# GPD AI Bingo

An interactive 5 × 5 bingo card for Global Product Design. Each square opens an activity page with a "Why try this?" explanation, a ready-to-copy prompt, steps, success criteria, an optional stretch and responsible-use notes. People stamp squares as they try them, and five in a row is Bingo.

There are 24 activities, 8 at each level:

| Level | Audience | Time |
|---|---|---|
| **Explore** (●○○) | New to AI, quick wins | 5–10 min |
| **Level Up** (●●○) | AI as a thinking partner | 10–25 min |
| **Go Further** (●●●) | Agents, building, workflow redesign, evaluating AI | 20–60 min |

The middle row is all Explore squares plus the FREE SPACE, so anyone can reach Bingo with four quick wins.

---

## What's in this folder

| File | What it is | Do you edit it? |
|---|---|---|
| `content.js` | **Every word on the site**: headline, board layout, all 24 activities and prompts | **Yes, this is the one to edit** |
| `index.html` | The page shell | Rarely |
| `styles.css` | Colors, layout, mobile and print styles | Only for design changes |
| `app.js` | Board, activity pages, stamping, Bingo detection, filters, Surprise Me, copy buttons | No |
| `fonts/` | Self-hosted fonts (SIL Open Font License), so nothing loads from outside | No |
| `vendor/qrcode.js` | QR code generator ([qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator), MIT) that draws the FREE SPACE QR code in the browser | No |
| `GPD-AI-Bingo-Card.pdf` | Printable blank card (US Letter, landscape) | Regenerate after content changes |
| `PRESENTER-AND-TEAMS.md` | 30–45 second presenter script and a Teams/email post | Yes |
| `tests/` | Automated browser checks and the PDF generator | No |

**Technology choice.** The site is plain HTML, CSS and JavaScript with no frameworks, no build step, no backend and no external calls. That makes it simple for IT to host and review: copy the folder to any static web server.

---

## Run it on your computer

**Quickest:** double-click `index.html`. It opens in your browser and everything works, including progress saving.

**As a local website** (closer to how it behaves once hosted), from this folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

`npx http-server -p 8080` works too, if you have Node.js.

---

## Edit the content (no coding needed)

Open `content.js` in any text editor (VS Code, Notepad, TextEdit in plain-text mode).

- **Change wording:** edit the text between quotes `"…"`. Prompts sit between backticks `` `…` ``.
- **Replace a challenge:** overwrite the fields in its `{ … }` block. If you change its `slug`, update the same slug in the `board` layout.
- **Rearrange the card:** reorder the slugs in `board` (5 rows of 5). Keep `"FREE"` in the middle.
- **Site link and QR code:** `shareUrl` holds the live address (`https://janvi618.github.io/gpd-ai-bingo/`). It becomes the QR code in the FREE SPACE (click it for a large, projector-friendly version) and is printed on the card. If the site moves, change it here and regenerate the PDF; set it to `""` to hide the QR code.

Rules that keep the file working:

1. Don't type a backtick ( ` ) inside a prompt.
2. Keep the commas between fields and between activity blocks.
3. Slugs use only lowercase letters, numbers and dashes.

After saving, refresh the page. If anything is inconsistent, such as a board slug with no matching activity, the site shows a **red message at the top** saying what to fix.

Each activity has these fields: `id`, `slug`, `level`, `square`, `title`, `category`, `time`, `summary`, `why`, `needs[]`, `prompt`, `steps[]`, `output`, `goodLooksLike[]`, `doneWhen`, `extension`, `watchFor[]`, and optionally `fallback` (the basic-chat alternative shown on Go Further pages) and `credit` (an attribution line shown in italics under the page summary, e.g. for the End Boring square).

---

## Production build and deployment

**There is no build step.** The folder is the production site. To deploy:

1. Copy these files and folders to the web server: `index.html`, `styles.css`, `content.js`, `app.js`, `fonts/`, `vendor/`, and (optionally) `GPD-AI-Bingo-Card.pdf`. You don't need to deploy `tests/` or the markdown files.
2. Serve them as static files. Any of these work:
   - An internal static web server (IIS, Apache, nginx)
   - An Azure Static Web App or an Azure Storage static website, with access restricted to the corporate tenant
   - SharePoint or Teams **only if** your tenant allows custom script pages (many don't; check with IT)
   - GitHub Pages on an internal or enterprise account, if approved
3. Open the hosted link and run a quick check: click a square, copy a prompt, mark it complete, refresh.
4. Put the real link into `shareUrl` in `content.js` (this also updates the QR code), regenerate the PDF (below), then scan the QR code with a phone to confirm it opens the site.

**No environment configuration is needed:** no API keys, secrets, databases or accounts.

**Hosting notes for IT:**

- The site makes **no network requests** beyond its own files: no analytics, fonts CDN, cookies or tracking. The automated test confirms this.
- Progress is stored in the browser's `localStorage` under the key `gpd-ai-bingo:v1`. It contains only which squares were stamped. Nothing identifies the employee, and nothing is transmitted.
- A strict Content Security Policy is compatible: `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'`.
- Links use `#hash` routing (for example `…/index.html#messy-notes`), so no server rewrite rules are needed and every activity has a shareable deep link.

---

## Test it

**Currently hosted at:** https://janvi618.github.io/gpd-ai-bingo/ (GitHub Pages, from the `main` branch of `janvi618/gpd-ai-bingo`). Updating the site = pushing changed files to that branch; Pages republishes in about a minute.

Automated checks (needs Node.js and Playwright: `npm i -D playwright && npx playwright install chromium`; add `npm i -D jsqr pngjs` to also scan the QR codes):

```bash
node tests/smoke-test.js
```

It runs the testing checklist from the brief in a real browser. That covers layout, all 24 pages opening correctly, Copy Prompt and Copy Full Instructions, stamping, persistence after refresh, undo, Bingo on rows, columns and diagonals with the FREE SPACE, filters, Surprise Me, keyboard navigation, reset confirmation, print layout, mobile width, and no external requests or JavaScript errors. It also saves screenshots to `tests/screenshots/`.

Regenerate the printable PDF after content edits:

```bash
node tests/make-print-pdf.js
```

Or open the site and click **Print / Save PDF**. The print layout turns off backgrounds and fits the full card on one landscape page.

---

## Accessibility and privacy at a glance

- Every square is a real link with a full screen-reader label (title, level, time, completed state). Arrow keys move around the board, and focus states are visible.
- Level is shown by dot count and text, not by color alone.
- Animations respect the "reduce motion" setting.
- On phones the card keeps its 5 columns and scrolls sideways, with a swipe hint and column dots.
- Progress is local to the browser and device. Clearing browser data or switching devices starts a fresh card, and the site says so.
