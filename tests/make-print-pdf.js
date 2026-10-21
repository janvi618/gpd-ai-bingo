/* Regenerates GPD-AI-Bingo-Card.pdf from the site's print layout (a blank card).
   Run from the gpd-ai-bingo folder:  node tests/make-print-pdf.js */
const path = require("path");
let playwright;
try { playwright = require("playwright"); } catch (e) { playwright = require("/opt/node22/lib/node_modules/playwright"); }
(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.goto("file://" + path.resolve(__dirname, "..", "index.html"));
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: "print" });
  const out = path.resolve(__dirname, "..", "GPD-AI-Bingo-Card.pdf");
  await page.pdf({ path: out, format: "Letter", landscape: true, printBackground: false, preferCSSPageSize: true });
  await browser.close();
  console.log("Wrote " + out);
})();
