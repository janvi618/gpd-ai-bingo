/* GPD AI Bingo — automated browser checks.
   Run from the gpd-ai-bingo folder:   node tests/smoke-test.js
   Needs Playwright (npm i -D playwright, or a global install) and a Chromium browser.
   It starts a tiny local web server, drives the site, and prints PASS/FAIL per check. */
const http = require("http");
const fs = require("fs");
const path = require("path");
let playwright;
try { playwright = require("playwright"); } catch (e) { playwright = require("/opt/node22/lib/node_modules/playwright"); }

const ROOT = path.resolve(__dirname, "..");
const OUT = process.env.SHOTS_DIR || path.join(ROOT, "tests", "screenshots");
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".pdf": "application/pdf" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]).replace(/\/$/, "/index.html"));
  if (!p.startsWith(ROOT) || !fs.existsSync(p)) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, {
    "Content-Type": TYPES[path.extname(p)] || "application/octet-stream",
    // Same strict policy the README recommends; any violation shows up as a console error below.
    "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'"
  });
  fs.createReadStream(p).pipe(res);
});

let failures = 0;
function check(name, cond, detail) {
  console.log((cond ? "PASS " : "FAIL ") + name + (detail ? "  (" + detail + ")" : ""));
  if (!cond) failures++;
}

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = "http://127.0.0.1:" + server.address().port + "/index.html";
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await playwright.chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ["clipboard-read", "clipboard-write"] });
  const page = await ctx.newPage();
  const errors = [];
  const external = [];
  page.on("pageerror", e => errors.push(e.stack || e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("request", r => { if (!r.url().startsWith(base.replace("/index.html", ""))) external.push(r.url()); });

  await page.goto(base);
  const B = await page.evaluate(() => window.BINGO);
  const cells = B.board.flat();

  // 1. Layout
  check("1. 25 cells: 24 squares + 1 free space", (await page.locator("#board .square").count()) === 24 && (await page.locator("#board .free").count()) === 1);
  const boxes = await page.locator("#board > *").evaluateAll(els => els.map(e => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top)]; }));
  check("1. Board renders as 5 columns x 5 rows", new Set(boxes.map(b => b[0])).size === 5 && new Set(boxes.map(b => b[1])).size === 5);
  check("1. FREE SPACE is in the center", (await page.locator("#board > *").nth(12).getAttribute("class")).includes("free"));
  check("Config validation reports no content errors", (await page.locator(".config-error").count()) === 0);

  // QR code in the FREE SPACE (decoded with an independent QR reader, if installed)
  if (B.site.shareUrl) {
    check("QR code shown in the FREE SPACE", (await page.locator("#board .free .qr-svg").count()) === 1);
    let jsQR, PNG;
    try { jsQR = require("jsqr"); PNG = require("pngjs").PNG; }
    catch (e) { try { const d = process.env.DECODER_MODULES; jsQR = require(d + "/jsqr"); PNG = require(d + "/pngjs").PNG; } catch (e2) { jsQR = null; } }
    const decode = async (loc) => { const png = PNG.sync.read(await loc.screenshot()); const r = jsQR(new Uint8ClampedArray(png.data), png.width, png.height); return r && r.data; };
    if (jsQR) {
      check("Small board QR code scans to the site link", (await decode(page.locator("#board .qr-tile"))) === B.site.shareUrl, B.site.shareUrl);
      await page.click("#free-qr");
      check("Clicking FREE SPACE opens the large QR code", await page.isVisible("#qr-dialog"));
      check("Large QR code scans to the site link", (await decode(page.locator(".qr-big"))) === B.site.shareUrl);
      await page.screenshot({ path: path.join(OUT, "desktop-qr-dialog.png") });
      await page.click("#qr-close");
    } else {
      console.log("SKIP QR decoding (install jsqr and pngjs to enable)");
    }
  }
  await page.screenshot({ path: path.join(OUT, "desktop-board.png"), fullPage: true });

  // 2-3. Every square opens the right page with complete content
  let allOk = true, thin = [];
  for (const slug of cells.filter(s => s !== "FREE")) {
    await page.goto(base + "#card");
    await page.click(`#board [data-slug="${slug}"]`);
    await page.waitForSelector("#activity-title");
    const a = B.activities.find(x => x.slug === slug);
    const title = await page.textContent("#activity-title");
    const sections = await page.locator(".section h2").allTextContents();
    const need = ["Why try this?", "What you need", "Try it now", "How it works", "What good looks like", "Go one step further", "Things to watch for"];
    const ok = title === a.title && need.every(n => sections.includes(n)) && (await page.textContent("#prompt-text")) === a.prompt;
    if (!ok) allOk = false;
    if (a.prompt.split(/\s+/).length < 80 || a.steps.length < 3) thin.push(slug);
    if (/\n {4,}\S/.test(a.prompt)) thin.push(slug + " (stray indentation in prompt)");
    if (a.level === "gofurther" && !sections.includes("No agents or code tools? Try this")) { allOk = false; thin.push(slug + " (no fallback)"); }
  }
  check("2. All 24 squares open the matching activity page", allOk);
  check("3. Every activity has a substantial prompt (80+ words) and 3+ steps", thin.length === 0, thin.join(", "));

  // 4-5. Copy buttons
  await page.goto(base + "#messy-notes");
  await page.click('.prompt-box [data-copy="prompt"]');
  let clip = await page.evaluate(() => navigator.clipboard.readText());
  check("4. Copy Prompt copies exactly the prompt", clip === B.activities.find(a => a.slug === "messy-notes").prompt);
  check("4. Copy shows feedback", (await page.textContent('.prompt-box [data-copy="prompt"]')).includes("Copied"));
  await page.click('[data-copy="full"]');
  clip = await page.evaluate(() => navigator.clipboard.readText());
  check("5. Copy Full Instructions includes prompt, steps, criteria and cautions", ["HOW IT WORKS", "WHAT GOOD LOOKS LIKE", "THINGS TO WATCH FOR", "TRY IT NOW"].every(k => clip.includes(k)) && clip.includes(B.activities[0].steps[0]));
  await page.screenshot({ path: path.join(OUT, "desktop-activity.png"), fullPage: true });

  // 6-8. Completion, persistence, undo
  await page.click("#mark-complete");
  check("6. Marking complete shows confirmation", await page.isVisible(".complete-status"));
  await page.click("#to-card");
  await page.waitForSelector("#board");
  check("6. Board shows the stamp", (await page.getAttribute('#board [data-slug="messy-notes"]', "class")).includes("done"));
  check("6. Progress reads 1 of 24", (await page.textContent("#progress-text")).trim() === "1 of 24 experiments tried");
  await page.reload();
  check("7. Completion persists after refresh", (await page.getAttribute('#board [data-slug="messy-notes"]', "class")).includes("done"));
  check("Opening a square does NOT complete it", !(await page.getAttribute('#board [data-slug="poke-holes"]', "class")).includes("done"));
  await page.goto(base + "#messy-notes");
  await page.click("#undo-complete");
  await page.goto(base + "#card");
  check("8. Undo removes the stamp", !(await page.getAttribute('#board [data-slug="messy-notes"]', "class")).includes("done"));

  // 9-10. Bingo detection: row 3 (4 Explore squares + FREE)
  for (const slug of ["kinder-email", "explain-it-twice", "slide-headline"]) {
    await page.goto(base + "#" + slug); await page.click("#mark-complete");
  }
  check("10. No bingo yet with 3 of 4 + free", (await page.evaluate(() => window.GPD_BINGO.lines())).length === 0);
  await page.goto(base + "#scary-task-checklist"); await page.click("#mark-complete");
  await page.waitForSelector("#bingo-dialog[open]");
  check("9/10. Row bingo using FREE SPACE triggers celebration", (await page.textContent("#bingo-dialog")).includes("BINGO"));
  await page.screenshot({ path: path.join(OUT, "desktop-bingo.png") });
  await page.click("#bingo-card");
  await page.waitForSelector("#board");
  check("9. Bingo line highlighted on the board", (await page.locator("#board .in-line").count()) === 5);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, "desktop-board-progress.png"), fullPage: false });

  // Column and diagonal via direct state (pure logic check)
  const lineCheck = await page.evaluate(() => {
    const key = "gpd-ai-bingo:v1";
    const B = window.BINGO, cells = B.board.flat();
    const test = idxs => { const completed = {}; idxs.forEach(i => { if (cells[i] !== "FREE") completed[cells[i]] = 1; }); localStorage.setItem(key, JSON.stringify({ completed, celebrated: [] })); };
    return { col: [2, 7, 12, 17, 22], diag: [0, 6, 12, 18, 24], anti: [4, 8, 12, 16, 20], test: test.toString() };
  });
  for (const [name, idxs] of Object.entries({ "column 3": lineCheck.col, "diagonal": lineCheck.diag, "anti-diagonal": lineCheck.anti, "column 1": [0, 5, 10, 15, 20] })) {
    await page.evaluate(idxs => { const cells = window.BINGO.board.flat(); const completed = {}; idxs.forEach(i => { if (cells[i] !== "FREE") completed[cells[i]] = 1; }); localStorage.setItem("gpd-ai-bingo:v1", JSON.stringify({ completed, celebrated: [], hintDismissed: true })); }, idxs);
    await page.reload();
    check("9. Bingo detected for " + name, (await page.evaluate(() => window.GPD_BINGO.lines())).length === 1);
  }

  // 11-12. Filters and Surprise me
  await page.evaluate(() => localStorage.setItem("gpd-ai-bingo:v1", JSON.stringify({ completed: { "messy-notes": 1, "poke-holes": 1 }, celebrated: [], hintDismissed: true })));
  await page.reload();
  await page.check("#start-gofurther");
  check("11. Filter highlights 8 Go Further squares", (await page.locator("#board .square.match").count()) === 8);
  check("11. Filter keeps all 24 squares in place", (await page.locator("#board .square").count()) === 24);
  check("11. Filter keeps progress", (await page.textContent("#progress-text")).startsWith("2 of 24"));
  let surpriseOk = true;
  for (let i = 0; i < 8; i++) {
    await page.click("#surprise-btn");
    await page.waitForSelector("#sp-go", { timeout: 4000 });
    const slug = (await page.getAttribute("#sp-go", "href")).slice(1);
    const a = B.activities.find(x => x.slug === slug);
    if (a.level !== "gofurther") surpriseOk = false;
  }
  check("12. Surprise me picks from the active level", surpriseOk);
  await page.screenshot({ path: path.join(OUT, "desktop-filter-surprise.png") });
  await page.check("#start-explore");
  let notDone = true;
  for (let i = 0; i < 10; i++) {
    await page.click("#surprise-btn");
    await page.waitForSelector("#sp-go", { timeout: 4000 });
    if ((await page.getAttribute("#sp-go", "href")) === "#messy-notes") notDone = false;
  }
  check("12. Surprise me never suggests a finished square", notDone);
  await page.check("#start-all");

  // 15. Keyboard
  await page.focus('#board [data-index="0"]');
  await page.keyboard.press("ArrowRight");
  check("15. Arrow keys move focus across the board", await page.evaluate(() => document.activeElement.getAttribute("data-index")) === "1");
  await page.keyboard.press("ArrowDown"); await page.keyboard.press("ArrowDown"); await page.keyboard.press("ArrowRight");
  check("15. Arrow keys skip the FREE SPACE", await page.evaluate(() => document.activeElement.getAttribute("data-index")) === "13");
  await page.keyboard.press("Enter");
  await page.waitForSelector("#activity-title");
  check("15. Enter opens the square", (await page.textContent("#activity-title")).length > 0);

  // Reset
  await page.goto(base + "#card");
  await page.click("#reset-btn");
  check("Reset asks for confirmation first", await page.isVisible("#reset-dialog"));
  await page.click("#reset-cancel");
  check("Cancelling reset keeps progress", (await page.textContent("#progress-text")).startsWith("2 of"));
  await page.click("#reset-btn"); await page.click("#reset-confirm");
  check("Confirming reset clears progress", (await page.textContent("#progress-text")).startsWith("0 of"));

  // 13. Print
  await page.emulateMedia({ media: "print" });
  const printCells = await page.locator(".print-card .pc-sq, .print-card .pc-free").count();
  check("13. Print card has 25 cells", printCells === 25);
  check("13. App UI hidden in print", !(await page.isVisible("#app")));
  if (B.site.shareUrl) check("13. Printed card includes the QR code", (await page.locator(".print-card .pc-qr").count()) === 1);
  await page.pdf({ path: path.join(OUT, "print-preview.pdf"), format: "Letter", landscape: true, printBackground: false });
  await page.emulateMedia({ media: "screen" });

  // 14. Mobile
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const mp = await m.newPage();
  await mp.goto(base);
  const overflow = await mp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  check("14. Mobile: page body has no sideways scroll", !overflow);
  check("14. Mobile: swipe indicator shown", await mp.isVisible(".swipe-hint"));
  await mp.screenshot({ path: path.join(OUT, "mobile-board.png"), fullPage: true });
  await mp.goto(base + "#three-expert-panel");
  check("14. Mobile: activity page fits width", !(await mp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)));
  await mp.screenshot({ path: path.join(OUT, "mobile-activity.png"), fullPage: false });

  check("17. No external network requests", external.length === 0, external.join(", "));
  check("No JavaScript errors", errors.length === 0, errors.join(" | "));

  await browser.close(); server.close();
  console.log(failures ? `\n${failures} check(s) failed.` : "\nAll checks passed.");
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); server.close(); process.exit(1); });
