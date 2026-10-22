/* GPD AI Bingo — records a ~1-minute demo video (MP4, 1920x1080).
   Run from the gpd-ai-bingo folder:   node tests/make-demo-video.js
   Needs Playwright + Chromium and ffmpeg (with libx264) on the PATH.
   Optional: DEMO_SQUARE=<slug> picks the square to open (default: end-boring).
   Output: demo/GPD-AI-Bingo-demo.mp4 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
let playwright;
try { playwright = require("playwright"); } catch (e) { playwright = require("/opt/node22/lib/node_modules/playwright"); }

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "demo");
const OUT = path.join(OUT_DIR, "GPD-AI-Bingo-demo.mp4");
const FRAMES = fs.mkdtempSync(path.join(require("os").tmpdir(), "bingo-frames-"));
const SQUARE = process.env.DEMO_SQUARE || "end-boring";
const W = 1920, H = 1080;

const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]).replace(/\/$/, "/index.html"));
  if (!p.startsWith(ROOT) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});

// Visible cursor + captions. Both are "popovers" so they can be raised above modal dialogs.
const OVERLAY = `
  #demo-cursor, #demo-caption { inset: auto; margin: 0; border: 0; padding: 0; background: transparent; overflow: visible; }
  #demo-cursor { position: fixed; left: 0; top: 0; width: 34px; height: 34px; pointer-events: none; transition: none; }
  #demo-cursor svg { width: 34px; height: 34px; filter: drop-shadow(0 3px 4px rgba(0,0,0,.45)); }
  #demo-cursor .ring { position: absolute; left: -22px; top: -22px; width: 44px; height: 44px; border-radius: 50%;
    border: 4px solid #f2bf5e; opacity: 0; transform: scale(.4); }
  #demo-cursor.click .ring { animation: demo-ring .5s ease-out; }
  @keyframes demo-ring { 0% { opacity: 1; transform: scale(.4); } 100% { opacity: 0; transform: scale(1.5); } }
  #demo-caption { position: fixed; left: 50%; bottom: 46px; transform: translateX(-50%); }
  #demo-caption .pill { display: inline-block; max-width: 1400px; padding: 18px 34px; border-radius: 999px;
    background: #1a1840; color: #fff; border: 3px solid #f2bf5e; box-shadow: 0 18px 50px rgba(0,0,0,.45);
    font: 700 34px/1.25 "Bricolage Grotesque", system-ui, sans-serif; text-align: center; white-space: nowrap;
    transition: opacity .35s ease, transform .35s ease; }
  #demo-caption .pill.hide { opacity: 0; transform: translateY(14px); }
  .qr-big { width: 420px !important; }
  .toast { display: none !important; }
`;
function installOverlay() {
  if (document.getElementById("demo-cursor")) return;
  const st = document.createElement("style"); st.textContent = window.__OVERLAY; document.head.appendChild(st);
  const c = document.createElement("div"); c.id = "demo-cursor"; c.setAttribute("popover", "manual");
  c.innerHTML = '<span class="ring"></span><svg viewBox="0 0 24 24"><path d="M4 2l15 9.5-6.6 1.4 3.9 7.3-2.9 1.5-3.9-7.3L4 19z" fill="#fff" stroke="#14112e" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  const cap = document.createElement("div"); cap.id = "demo-caption"; cap.setAttribute("popover", "manual");
  cap.innerHTML = '<span class="pill hide"></span>';
  document.body.append(c, cap);
  c.showPopover(); cap.showPopover();
  document.addEventListener("mousemove", e => { c.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 2}px)`; }, true);
  document.addEventListener("mousedown", () => { c.classList.remove("click"); void c.offsetWidth; c.classList.add("click"); }, true);
  window.__raise = () => { c.classList.remove("click"); for (const el of [cap, c]) { el.hidePopover(); el.showPopover(); } };
  window.__caption = (t) => {
    const pill = cap.querySelector(".pill");
    pill.classList.add("hide");
    setTimeout(() => { if (t) { pill.textContent = t; pill.classList.remove("hide"); } }, t && pill.textContent ? 350 : 0);
  };
}

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = "http://127.0.0.1:" + server.address().port + "/index.html";
  const browser = await playwright.chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, permissions: ["clipboard-read", "clipboard-write"] });
  const page = await ctx.newPage();
  await page.addInitScript(o => { window.__OVERLAY = o; }, OVERLAY);

  // Record every painted frame with its timestamp.
  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", async f => {
    const file = path.join(FRAMES, String(frames.length).padStart(6, "0") + ".jpg");
    frames.push({ file, t: f.metadata.timestamp, wall: Date.now() });
    fs.writeFileSync(file, Buffer.from(f.data, "base64"));
    try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch (e) {}
  });

  const wait = ms => page.waitForTimeout(ms);
  const overlay = () => page.evaluate(installOverlay);
  const caption = t => page.evaluate(t => window.__caption(t), t);
  let mouse = { x: W * 0.62, y: H * 0.45 };
  async function moveTo(sel, ms = 900) {
    const box = await page.locator(sel).first().boundingBox();
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    const steps = Math.max(10, Math.round(ms / 16));
    for (let i = 1; i <= steps; i++) {
      const k = i / steps, e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      await page.mouse.move(mouse.x + (x - mouse.x) * e, mouse.y + (y - mouse.y) * e);
    }
    mouse = { x, y };
  }
  async function click(sel, ms) { await moveTo(sel, ms); await wait(250); await page.mouse.down(); await page.mouse.up(); }
  async function scrollTo(y, ms = 1200) {
    await page.evaluate(([y, ms]) => new Promise(done => {
      const y0 = scrollY, t0 = performance.now();
      (function step(t) {
        const k = Math.min(1, (t - t0) / ms), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        scrollTo(0, y0 + (y - y0) * e);
        k < 1 ? requestAnimationFrame(step) : done();
      })(t0);
    }), [y, ms]);
  }
  const top = sel => page.evaluate(s => document.querySelector(s).getBoundingClientRect().top + scrollY, sel);

  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await overlay();
  await page.mouse.move(mouse.x, mouse.y);
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
  const start = Date.now();

  // 1. The card
  await wait(600);
  await caption("GPD AI Bingo: 24 AI experiments, from quick wins to ambitious builds");
  await wait(3600);
  await scrollTo(await top(".card") - 40, 1400);
  await caption("New to AI? Filter for quick wins. Or explore everything.");
  await click('label.pill:has(#start-explore)', 900);
  await wait(2200);
  await click('label.pill:has(#start-all)', 700);
  await wait(900);
  await caption("Pick any square that catches your eye");
  await click(`#board [data-slug="${SQUARE}"]`, 1100);

  // 2. The activity page
  await page.waitForSelector("#activity-title");
  await overlay();
  await page.mouse.move(mouse.x, mouse.y);
  if (SQUARE === "end-boring") {
    await caption("Squares build on what GPD already knows, like Ivan Wanis Ruiz’s End Boring");
    await wait(4200);
  }
  await caption("Each square explains why it’s worth trying and what you need");
  await wait(3800);
  await scrollTo(await top("#try") - 120, 1400);
  await caption("Then gives you a ready-to-use prompt. Copy it into your approved AI tool.");
  await wait(1500);
  await click('.prompt-box [data-copy="prompt"]', 900);
  await wait(2600);
  await scrollTo(await top(".steps") - 160, 1500);
  await caption("Simple steps, what good looks like, and things to watch for");
  await wait(3600);
  await caption("Tried it? Stamp your square.");
  await click("#mark-complete", 1000);
  await wait(2000);
  await click("#to-card", 800);

  // 3. Back on the card, now stamped
  await page.waitForSelector("#board");
  await overlay();
  await page.mouse.move(mouse.x, mouse.y);
  await caption("Five in a row is Bingo. But one square is a win.");
  await wait(3600);

  // 4. QR code
  await caption("");
  await click("#free-qr", 1100);
  await page.waitForSelector("#qr-dialog[open]");
  await page.evaluate(() => window.__raise());
  await page.mouse.move(W - 80, H - 60);
  await caption("Scan to try one square");
  await wait(9000);

  await cdp.send("Page.stopScreencast");
  // Nothing repaints while the QR code holds still, so extend the last frame to the real stop time.
  const last = frames[frames.length - 1];
  const end = last.t + (Date.now() - last.wall) / 1000;
  await browser.close(); server.close();

  // Stitch frames, honoring real timing, into a constant 30 fps H.264 MP4.
  const list = path.join(FRAMES, "list.txt");
  let txt = "";
  frames.forEach((f, i) => {
    const next = i + 1 < frames.length ? frames[i + 1].t : end;
    txt += `file '${f.file}'\nduration ${Math.max(0.001, next - f.t).toFixed(4)}\n`;
  });
  txt += `file '${frames[frames.length - 1].file}'\n`;
  fs.writeFileSync(list, txt);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list,
    "-vf", `fps=30,scale=${W}:${H}:flags=lanczos,format=yuv420p`, "-c:v", "libx264", "-preset", "slow", "-crf", "18",
    "-movflags", "+faststart", OUT]);
  fs.rmSync(FRAMES, { recursive: true, force: true });
  console.log(`Wrote ${OUT} (${frames.length} frames captured, ~${Math.round((Date.now() - start) / 1000)}s)`);
})().catch(e => { console.error(e); server.close(); process.exit(1); });
