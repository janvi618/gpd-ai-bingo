/* GPD AI Bingo — application logic.
   Content lives in content.js. Progress is stored only in this browser (localStorage).
   Nothing is sent to any server. */
(function () {
  "use strict";

  var B = window.BINGO || {};
  var SITE = B.site || {};
  var LEVELS = B.levels || {};
  var LEVEL_ORDER = ["explore", "levelup", "gofurther"];
  var STORAGE_KEY = "gpd-ai-bingo:v1";
  var FREE = "FREE";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var app = document.getElementById("app");
  var toastEl = document.getElementById("toast");

  // ---------- Content lookup & validation ----------
  var activities = Array.isArray(B.activities) ? B.activities : [];
  var bySlug = {};
  activities.forEach(function (a) { bySlug[a.slug] = a; });
  var board = Array.isArray(B.board) ? B.board : [];
  var cells = [].concat.apply([], board); // 25 slugs in reading order

  function validate() {
    var errs = [];
    if (board.length !== 5 || board.some(function (r) { return !Array.isArray(r) || r.length !== 5; })) {
      errs.push("The <code>board</code> must have 5 rows of 5 entries each.");
    }
    cells.forEach(function (s) {
      if (s !== FREE && !bySlug[s]) errs.push("The board mentions <code>" + esc(s) + "</code>, but no activity has that slug.");
    });
    var seen = {};
    activities.forEach(function (a) {
      if (seen[a.slug]) errs.push("Two activities share the slug <code>" + esc(a.slug) + "</code>.");
      seen[a.slug] = true;
      if (!LEVELS[a.level]) errs.push("Activity <code>" + esc(a.slug) + "</code> has an unknown level <code>" + esc(a.level) + "</code>.");
      if (!/^[a-z0-9-]+$/.test(a.slug || "")) errs.push("Slug <code>" + esc(a.slug) + "</code> should use only lowercase letters, numbers and dashes.");
      if (cells.indexOf(a.slug) === -1) errs.push("Activity <code>" + esc(a.slug) + "</code> isn't placed on the board.");
    });
    return errs;
  }
  var configErrors = validate();
  var playable = cells.filter(function (s) { return s !== FREE && bySlug[s]; });

  // ---------- Storage (local only) ----------
  var storageOK = true;
  var state = { completed: {}, celebrated: [], hintDismissed: false, filter: "all" };
  try {
    var raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state.completed = parsed.completed && typeof parsed.completed === "object" ? parsed.completed : {};
        state.celebrated = Array.isArray(parsed.celebrated) ? parsed.celebrated : [];
        state.hintDismissed = !!parsed.hintDismissed;
        state.filter = LEVELS[parsed.filter] ? parsed.filter : "all";
      }
    }
  } catch (e) { storageOK = false; }
  function save() {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageOK = true; }
    catch (e) { storageOK = false; }
  }
  function isDone(slug) { return slug === FREE || !!state.completed[slug]; }
  function doneCount() { return playable.filter(function (s) { return state.completed[s]; }).length; }

  // ---------- Bingo lines ----------
  var LINES = (function () {
    var L = [], r, c;
    for (r = 0; r < 5; r++) L.push({ key: "row" + (r + 1), idx: [0, 1, 2, 3, 4].map(function (c) { return r * 5 + c; }) });
    for (c = 0; c < 5; c++) L.push({ key: "col" + (c + 1), idx: [0, 1, 2, 3, 4].map(function (r) { return r * 5 + c; }) });
    L.push({ key: "diag1", idx: [0, 6, 12, 18, 24] });
    L.push({ key: "diag2", idx: [4, 8, 12, 16, 20] });
    return L;
  })();
  function completeLines() {
    return LINES.filter(function (l) { return l.idx.every(function (i) { return isDone(cells[i]); }); });
  }
  function lineName(key) {
    if (key.indexOf("row") === 0) return "Row " + key.slice(3);
    if (key.indexOf("col") === 0) return "Column " + key.slice(3);
    return "Diagonal";
  }

  // ---------- Helpers ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  // QR code for SITE.shareUrl, drawn as crisp SVG (prints without background graphics).
  // Includes a 4-module white quiet zone so phones can read it on the dark square.
  function qrSvg(cls) {
    var url = SITE.shareUrl;
    if (!url || typeof window.qrcode !== "function") return "";
    try {
      var qr = window.qrcode(0, "M");
      qr.addData(url); qr.make();
      var n = qr.getModuleCount(), q = 4, size = n + q * 2, d = "";
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (qr.isDark(r, c)) d += "M" + (c + q) + " " + (r + q) + "h1v1h-1z";
      return '<svg class="' + cls + '" viewBox="0 0 ' + size + " " + size + '" shape-rendering="crispEdges" aria-hidden="true">' +
        '<rect width="' + size + '" height="' + size + '" fill="#ffffff"/><path d="' + d + '" fill="#000000"/></svg>';
    } catch (e) { return ""; }
  }
  function levelLabel(l) { return (LEVELS[l] && LEVELS[l].label) || l; }
  function pips(level) {
    var n = LEVEL_ORDER.indexOf(level) + 1, out = '<span class="pips" aria-hidden="true">';
    for (var i = 1; i <= 3; i++) out += '<i class="' + (i <= n ? "" : "off") + '"></i>';
    return out + "</span>";
  }
  var ICON = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    seal: '<svg class="free-mark" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-dasharray="3 3"/><circle cx="20" cy="20" r="11" fill="currentColor"/><path d="M14.5 20.5l3.6 3.6 7.4-7.6" fill="none" stroke="#1a1840" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  // ---------- Toast ----------
  var toastTimer;
  function toast(msg, action) {
    clearTimeout(toastTimer);
    toastEl.innerHTML = "<span>" + esc(msg) + "</span>" + (action ? '<a class="btn btn-gold" href="' + esc(action.href) + '">' + esc(action.label) + "</a>" : "");
    toastEl.hidden = false;
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, action ? 6000 : 2600);
  }

  // ---------- Clipboard ----------
  function copyText(text, btn) {
    var original = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", original);
    function ok() { flash(btn, "Copied!"); toast(text === SITE.shareUrl ? "Link copied." : "Copied to your clipboard. Paste it into your approved AI tool."); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0"; ta.style.top = "0";
      document.body.appendChild(ta); ta.select();
      var worked = false;
      try { worked = document.execCommand("copy"); } catch (e) { worked = false; }
      document.body.removeChild(ta);
      if (worked) ok(); else { flash(btn, "Select & copy"); toast("Your browser blocked copying. Select the prompt text and press Ctrl+C (or Cmd+C)."); selectPrompt(); }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } else { fallback(); }
  }
  function selectPrompt() {
    var pre = document.querySelector(".prompt-text");
    if (!pre || !window.getSelection) return;
    var range = document.createRange(); range.selectNodeContents(pre);
    var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
  }
  function flash(btn, label) {
    var span = btn.querySelector(".lbl");
    if (!span) return;
    var prev = btn.getAttribute("data-label-text") || span.textContent;
    btn.setAttribute("data-label-text", prev);
    span.textContent = label;
    setTimeout(function () { span.textContent = prev; }, 2000);
  }

  function fullInstructions(a) {
    var L = [];
    var line = function (s) { L.push(s); };
    var list = function (arr, numbered) { (arr || []).forEach(function (x, i) { line((numbered ? (i + 1) + ". " : "- ") + x); }); };
    line("GPD AI BINGO: " + a.title.toUpperCase());
    line("Level: " + levelLabel(a.level) + " | Time: " + a.time + " | Category: " + a.category);
    line("");
    line(a.summary);
    line("");
    line("WHY TRY THIS?"); line(a.why); line("");
    line("WHAT YOU NEED"); list(a.needs); line("");
    line("TRY IT NOW: COPY THIS PROMPT INTO YOUR APPROVED AI TOOL");
    line("----------"); line(a.prompt); line("----------"); line("");
    line("HOW IT WORKS"); list(a.steps, true); line("");
    if (a.fallback) { line("NO AGENTS OR CODE TOOLS? TRY THIS"); line(a.fallback); line(""); }
    line("WHAT YOU'LL END UP WITH"); line(a.output); line("");
    line("WHAT GOOD LOOKS LIKE"); list(a.goodLooksLike); line("Done when: " + a.doneWhen); line("");
    line("GO ONE STEP FURTHER"); line(a.extension); line("");
    line("THINGS TO WATCH FOR"); list(a.watchFor); line("");
    line((SITE.responsibleUse || []).join(" "));
    return L.join("\n");
  }

  // ---------- Routing ----------
  var lastBoardScroll = 0;
  var returnFocusSlug = null;
  var justStamped = null;

  function currentSlug() {
    var h = decodeURIComponent((location.hash || "").replace(/^#\/?/, ""));
    return h;
  }
  function route() {
    clearTimeout(surpriseTimer);
    var slug = currentSlug();
    if (slug && slug !== "main" && bySlug[slug]) renderActivity(bySlug[slug]);
    else if (slug && slug !== "main" && slug !== "card") renderNotFound(slug);
    else renderBoard();
  }

  // ---------- Board view ----------
  function renderBoard() {
    document.body.className = "view-board";
    document.title = (SITE.cardTitle ? titleCase(SITE.cardTitle) : "GPD AI Bingo");
    var filter = state.filter;
    var lines = completeLines();
    var inLine = {};
    lines.forEach(function (l) { l.idx.forEach(function (i) { inLine[i] = true; }); });
    var count = doneCount();
    var total = playable.length;
    var showHint = !state.hintDismissed && count === 0;

    var html = "";
    html += '<header class="hero"><div class="wrap hero-inner"><div>';
    html += '<p class="eyebrow">' + esc(SITE.eyebrow) + "</p>";
    html += "<h1>" + esc(SITE.headline) + "</h1>";
    html += '<p class="hero-sub">' + esc(SITE.subhead) + "</p>";
    html += '</div><div class="sticky-note" aria-hidden="true">' + esc(SITE.stickyNote) + "</div></div></header>";

    html += '<main id="main" class="wrap" tabindex="-1">';
    if (configErrors.length) {
      html += '<div class="config-error" role="alert"><strong>Content file needs a fix (content.js):</strong><ul>' +
        configErrors.map(function (e) { return "<li>" + e + "</li>"; }).join("") + "</ul></div>";
    }

    // Toolbar
    html += '<div class="toolbar">';
    html += '<fieldset class="start-picker"><legend>Where would you like to start?</legend><div class="pills">';
    var opts = [["all", "All challenges"]].concat(LEVEL_ORDER.map(function (l) { return [l, (LEVELS[l] && LEVELS[l].pickerLabel) || levelLabel(l)]; }));
    opts.forEach(function (o) {
      html += '<label class="pill"><input type="radio" name="start" id="start-' + o[0] + '" value="' + o[0] + '"' + (filter === o[0] ? " checked" : "") + ">" +
        "<span>" + (o[0] === "all" ? "" : '<span class="lvl-' + o[0] + '" style="display:inline-flex">' + pips(o[0]) + "</span>") + esc(o[1]) + "</span></label>";
    });
    html += "</div></fieldset>";
    html += '<button type="button" class="btn btn-gold" id="surprise-btn">' + ICON.dice + '<span class="lbl">Surprise me</span></button>';
    html += "</div>";
    html += '<div id="surprise-panel" class="surprise-panel" aria-live="polite" hidden></div>';

    // Card
    html += '<section class="card" aria-labelledby="card-title">';
    html += '<div class="card-head"><div><p class="card-kicker">' + esc(SITE.cardKicker) + '</p><h2 class="card-title" id="card-title">' + esc(SITE.cardTitle) + "</h2></div>";
    html += '<p class="card-instruction">' + esc(SITE.instruction) + "</p></div>";
    html += '<ul class="legend" aria-label="Difficulty key">' + LEVEL_ORDER.map(function (l) {
      return '<li><span class="lvl-' + l + '">' + pips(l) + "</span><strong>" + esc(levelLabel(l)) + "</strong> " + esc(LEVELS[l] ? LEVELS[l].blurb : "") + "</li>";
    }).join("") + "</ul>";

    html += '<div class="board-scroller" id="board-scroller">';
    if (showHint) {
      html += '<div class="hint-row" id="hint"><div class="hint" role="note"><span>' + esc(SITE.firstTimeHint) + '</span><button type="button" id="hint-close" aria-label="Dismiss tip">' + ICON.close + "</button></div></div>";
    }
    html += '<div class="board-viewport" id="board-viewport" tabindex="-1">';
    html += '<div class="board' + (filter !== "all" ? " filtering" : "") + '" id="board" role="group" aria-label="Bingo card, 5 rows by 5 columns. Arrow keys move between squares.">';
    for (var r = 0; r < 5; r++) {
      for (var c = 0; c < 5; c++) {
        var i = r * 5 + c, slug = cells[i];
        if (slug === FREE) {
          var qrMark = qrSvg("qr-svg");
          if (qrMark) {
            html += '<button type="button" id="free-qr" class="free has-qr' + (inLine[i] ? " in-line" : "") + '" aria-label="Free space, always marked. Show a large QR code to open this site on a phone.">' +
              '<span class="qr-tile">' + qrMark + '</span><span class="free-text"><span class="free-label">FREE<br>SPACE</span><span class="free-sub">Scan to open on your phone</span></span></button>';
          } else {
            html += '<div role="img" class="free' + (inLine[i] ? " in-line" : "") + '" aria-label="Free space. Always marked.">' + ICON.seal +
              '<span class="free-label">FREE<br>SPACE</span><span class="free-sub">On the house</span></div>';
          }
          continue;
        }
        var a = bySlug[slug];
        if (!a) { html += '<div class="square" aria-label="Missing activity"><span class="sq-title">Missing: ' + esc(slug) + "</span></div>"; continue; }
        var done = !!state.completed[slug];
        var cls = "square lvl-b-" + a.level + (done ? " done" : "") + (filter === a.level ? " match" : "") + (inLine[i] ? " in-line" : "") + (justStamped === slug ? " just-stamped" : "");
        var label = a.square + " " + levelLabel(a.level) + " level, " + a.time + "." + (done ? " Completed." : "");
        html += '<a class="' + cls + '" href="#' + esc(slug) + '" data-slug="' + esc(slug) + '" data-index="' + i + '" aria-label="' + esc(label) + '">' +
          (done ? '<span class="stamp" aria-hidden="true">' + ICON.check + "Tried</span>" : "") +
          '<span class="sq-title">' + esc(a.square) + "</span>" +
          '<span class="sq-foot" aria-hidden="true"><span class="sq-level lvl-' + a.level + '">' + pips(a.level) + '<span class="sq-level-text">' + esc(levelLabel(a.level)) + '</span></span><span class="sq-time">' + esc(a.time.replace(/ min$/, "m")) + "</span></span></a>";
      }
    }
    html += "</div></div>";
    html += '<div class="swipe-hint" aria-hidden="true"><span id="swipe-text">Swipe to see all 5 columns →</span><span class="swipe-dots" id="swipe-dots"><i></i><i></i><i></i><i></i><i></i></span></div>';
    html += "</div>";

    html += '<div class="card-foot"><div class="progress"><span class="progress-text" id="progress-text">' + count + " of " + total + " experiments tried</span>" +
      '<span class="progress-bar" role="progressbar" aria-label="Experiments tried" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + count + '"><span style="width:' + (total ? (count / total * 100) : 0) + '%"></span></span>' +
      (lines.length ? '<span class="bingo-count">' + lines.length + " Bingo" + (lines.length > 1 ? "s" : "") + "!</span>" : "") + "</div>";
    html += '<p class="one-square">' + esc(SITE.bottomMessage) + "</p></div>";
    html += "</section>";

    html += '<div class="under-card"><p class="privacy-note">' +
      (storageOK
        ? "Your progress is saved only in this browser on this device. Nothing is sent anywhere. Clearing browser data or switching devices starts a fresh card."
        : '<span class="storage-warning">This browser isn’t letting the site save progress (private mode or blocked storage). Your stamps will last until you close this tab.</span>') +
      '</p><div class="actions">' +
      (window.BINGO_HIDE_PRINT ? "" : '<button type="button" class="btn btn-ghost btn-small" id="print-btn">' + ICON.print + "<span>Print / Save PDF</span></button>") +
      '<button type="button" class="btn btn-ghost btn-small" id="reset-btn"' + (count ? "" : " disabled") + ">Reset progress</button></div></div>";
    html += "</main>";
    html += siteFooter();

    // Reset dialog
    html += '<dialog class="modal" id="reset-dialog" aria-labelledby="reset-title"><div class="modal-body"><h2 id="reset-title">Start a fresh card?</h2>' +
      "<p>This clears all " + count + " stamps saved in this browser. You can’t undo it.</p>" +
      '<div class="modal-actions"><button type="button" class="btn btn-outline-ink" id="reset-cancel">Keep my progress</button><button type="button" class="btn btn-ink" id="reset-confirm">Clear my card</button></div></div></dialog>';

    if (SITE.shareUrl) {
      html += '<dialog class="modal qr-modal" id="qr-dialog" aria-labelledby="qr-title"><div class="modal-body"><h2 id="qr-title">Scan to play on your phone</h2>' +
        '<div class="qr-big">' + qrSvg("qr-svg") + "</div>" +
        '<p class="qr-url" id="qr-url">' + esc(SITE.shareUrl) + "</p>" +
        '<div class="modal-actions"><button type="button" class="btn btn-outline-ink" id="qr-copy"><span class="lbl">Copy link</span></button><button type="button" class="btn btn-ink" id="qr-close">Done</button></div></div></dialog>';
    }
    app.innerHTML = html;
    renderPrintCard();
    justStamped = null;
    wireBoard();
  }

  function titleCase(s) { return s.toLowerCase().replace(/\b(ai|gpd)\b/g, function (m) { return m.toUpperCase(); }).replace(/\b\w/g, function (m) { return m.toUpperCase(); }); }

  function siteFooter() {
    return '<footer class="site-foot wrap"><div class="ru">' + (SITE.responsibleUse || []).map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + "</div>" +
      "<p>An internal experiment for Global Product Design, inspired by the AI Bingo card from Feedforward. No accounts, no tracking.</p></footer>";
  }

  function wireBoard() {
    var boardEl = document.getElementById("board");
    // Filter
    Array.prototype.forEach.call(document.querySelectorAll('input[name="start"]'), function (inp) {
      inp.addEventListener("change", function () {
        state.filter = inp.value; save();
        boardEl.classList.toggle("filtering", state.filter !== "all");
        Array.prototype.forEach.call(boardEl.querySelectorAll(".square"), function (sq) {
          var a = bySlug[sq.getAttribute("data-slug")];
          sq.classList.toggle("match", !!a && a.level === state.filter);
        });
        var panel = document.getElementById("surprise-panel"); if (panel) panel.hidden = true;
      });
    });
    // Remember where we were
    boardEl.addEventListener("click", function (e) {
      var sq = e.target.closest && e.target.closest(".square[data-slug]");
      if (!sq) return;
      lastBoardScroll = window.scrollY;
      returnFocusSlug = sq.getAttribute("data-slug");
      if (!state.hintDismissed) { state.hintDismissed = true; save(); }
    });
    // Arrow-key navigation between squares
    boardEl.addEventListener("keydown", function (e) {
      var keys = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] };
      var d = keys[e.key]; if (!d) return;
      var cur = document.activeElement; if (!cur || !cur.hasAttribute("data-index")) return;
      var idx = +cur.getAttribute("data-index"), r = Math.floor(idx / 5), c = idx % 5;
      for (var step = 0; step < 5; step++) {
        r += d[0]; c += d[1];
        if (r < 0 || r > 4 || c < 0 || c > 4) return;
        var next = boardEl.querySelector('[data-index="' + (r * 5 + c) + '"]');
        if (next) { e.preventDefault(); next.focus(); next.scrollIntoView({ block: "nearest", inline: "nearest" }); return; }
      }
    });
    // Big QR code
    var fq = document.getElementById("free-qr"), qd = document.getElementById("qr-dialog");
    if (fq && qd) {
      fq.addEventListener("click", function () { if (qd.showModal) qd.showModal(); else qd.setAttribute("open", ""); document.getElementById("qr-close").focus(); });
      document.getElementById("qr-close").addEventListener("click", function () { qd.close ? qd.close() : qd.removeAttribute("open"); fq.focus(); });
      document.getElementById("qr-copy").addEventListener("click", function () { copyText(SITE.shareUrl, this); });
    }
    // Hint
    var hc = document.getElementById("hint-close");
    if (hc) hc.addEventListener("click", function () { state.hintDismissed = true; save(); var h = document.getElementById("hint"); if (h) h.remove(); });
    // Surprise
    document.getElementById("surprise-btn").addEventListener("click", surprise);
    // Print
    var pb = document.getElementById("print-btn");
    if (pb) pb.addEventListener("click", function () { window.print(); });
    // Reset
    var dlg = document.getElementById("reset-dialog");
    document.getElementById("reset-btn").addEventListener("click", function () {
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
      document.getElementById("reset-cancel").focus();
    });
    document.getElementById("reset-cancel").addEventListener("click", function () { dlg.close ? dlg.close() : dlg.removeAttribute("open"); });
    document.getElementById("reset-confirm").addEventListener("click", function () {
      state.completed = {}; state.celebrated = []; save();
      if (dlg.close) dlg.close();
      renderBoard();
      toast("Fresh card. Start anywhere.");
      var rb = document.getElementById("surprise-btn"); if (rb) rb.focus();
    });
    // Swipe indicator
    var vp = document.getElementById("board-viewport");
    var scroller = document.getElementById("board-scroller");
    function updateSwipe() {
      var overflow = vp.scrollWidth > vp.clientWidth + 2;
      scroller.classList.toggle("has-overflow", overflow);
      if (!overflow) return;
      var atEnd = vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 4;
      scroller.classList.toggle("at-end", atEnd);
      var colW = vp.scrollWidth / 5;
      var first = Math.floor((vp.scrollLeft + 4) / colW), last = Math.floor((vp.scrollLeft + vp.clientWidth - 4) / colW);
      Array.prototype.forEach.call(document.querySelectorAll("#swipe-dots i"), function (dot, k) { dot.classList.toggle("on", k >= first && k <= last); });
      document.getElementById("swipe-text").textContent = atEnd ? "← Swipe back for columns 1–" + Math.max(1, first) : "Swipe to see all 5 columns →";
    }
    vp.addEventListener("scroll", updateSwipe, { passive: true });
    window.addEventListener("resize", updateSwipe);
    updateSwipe();

    // Restore position & focus after returning from an activity
    if (returnFocusSlug) {
      var back = boardEl.querySelector('[data-slug="' + returnFocusSlug + '"]');
      window.scrollTo(0, lastBoardScroll);
      if (back) { back.focus({ preventScroll: true }); back.scrollIntoView({ block: "nearest", inline: "nearest" }); }
      returnFocusSlug = null;
    }
  }

  // ---------- Surprise me ----------
  var surpriseTimer;
  function surprise() {
    var panel = document.getElementById("surprise-panel");
    var pool = playable.filter(function (s) { return !state.completed[s] && (state.filter === "all" || bySlug[s].level === state.filter); });
    var note = "";
    if (!pool.length) {
      if (state.filter !== "all" && playable.some(function (s) { return !state.completed[s]; })) {
        note = "You’ve tried every " + levelLabel(state.filter) + " challenge. Here’s one from another level.";
        pool = playable.filter(function (s) { return !state.completed[s]; });
      } else {
        panel.innerHTML = '<div class="sp-text"><div class="sp-label">Full card!</div><div class="sp-title">You’ve tried all ' + playable.length + " experiments.</div><div class=\"sp-meta\">Pick a favorite and try its “Go one step further” idea.</div></div>";
        panel.hidden = false; return;
      }
    }
    var pick = pool[Math.floor(Math.random() * pool.length)];
    var boardEl = document.getElementById("board");
    var squares = Array.prototype.slice.call(boardEl.querySelectorAll(".square[data-slug]"));
    clearTimeout(surpriseTimer);
    squares.forEach(function (s) { s.classList.remove("spotlight"); });
    var target = boardEl.querySelector('[data-slug="' + pick + '"]');
    var hops = reduceMotion ? 0 : 7, n = 0;
    (function hop() {
      if (!panel.isConnected || !target || !target.isConnected) return;
      squares.forEach(function (s) { s.classList.remove("spotlight"); });
      if (n < hops) {
        var cand = pool.length > 1 ? pool : playable;
        var s = boardEl.querySelector('[data-slug="' + cand[Math.floor(Math.random() * cand.length)] + '"]');
        if (s) s.classList.add("spotlight");
        n++; surpriseTimer = setTimeout(hop, 90 + n * 18);
        return;
      }
      target.classList.add("spotlight");
      target.scrollIntoView({ block: "nearest", inline: "center", behavior: reduceMotion ? "auto" : "smooth" });
      var a = bySlug[pick];
      panel.innerHTML = '<div class="sp-text"><div class="sp-label">' + (note ? esc(note) : "How about this one?") + '</div><div class="sp-title">' + esc(a.title) + "</div>" +
        '<div class="sp-meta">' + esc(levelLabel(a.level)) + " · " + esc(a.time) + " · " + esc(a.category) + "</div></div>" +
        '<div class="sp-actions"><a class="btn btn-gold" id="sp-go" href="#' + esc(a.slug) + '">Let’s try it</a><button type="button" class="btn btn-ghost" id="sp-again">Another one</button></div>';
      panel.hidden = false;
      panel.querySelector("#sp-again").addEventListener("click", surprise);
      panel.querySelector("#sp-go").addEventListener("click", function () { lastBoardScroll = window.scrollY; returnFocusSlug = a.slug; });
      surpriseTimer = setTimeout(function () { target.classList.remove("spotlight"); }, 3200);
    })();
  }

  // ---------- Print card ----------
  // Text dots (not CSS shapes) so they print even with background graphics turned off.
  function textPips(level) { var n = LEVEL_ORDER.indexOf(level) + 1; return '<span class="tp" aria-hidden="true">' + "●●●".slice(0, n) + "○○○".slice(0, 3 - n) + "</span>"; }
  function renderPrintCard() {
    var pc = document.getElementById("print-card");
    if (!pc) { pc = document.createElement("div"); pc.id = "print-card"; pc.className = "print-card"; document.body.appendChild(pc); }
    var h = '<div class="pc-head"><div><p class="pc-eyebrow">' + esc(SITE.eyebrow) + '</p><p class="pc-q">' + esc(SITE.headline) + '</p></div><h1 class="pc-title">' + esc(SITE.cardTitle) + "</h1></div>";
    h += '<p class="pc-instr">' + esc(SITE.instruction) + " Stamp or check each square you try.</p>";
    h += '<p class="pc-legend">' + LEVEL_ORDER.map(function (l) { return textPips(l) + " <b>" + esc(levelLabel(l)) + "</b> " + esc(LEVELS[l] ? LEVELS[l].blurb : ""); }).join(" &nbsp;·&nbsp; ") + "</p>";
    h += '<div class="pc-grid">';
    cells.forEach(function (s) {
      if (s === FREE) {
        var pq = qrSvg("pc-qr");
        h += pq ? '<div class="pc-free has-qr">' + pq + '<div>FREE<br>SPACE<small>Scan for how-tos</small></div></div>'
                : '<div class="pc-free"><div>FREE SPACE<small>On the house</small></div></div>';
        return;
      }
      var a = bySlug[s]; if (!a) { h += '<div class="pc-sq"></div>'; return; }
      var done = !!state.completed[s];
      h += '<div class="pc-sq' + (done ? " done" : "") + '"><div class="t">' + esc(a.square) + '</div><div class="l"><span>' + textPips(a.level) + " " + esc(levelLabel(a.level)) + "</span><span>" + (done ? "✓ Tried" : "☐") + "</span></div></div>";
    });
    h += "</div>";
    h += '<div class="pc-foot"><p><b>' + esc(SITE.bottomMessage) + "</b> " +
      (SITE.shareUrl ? "Instructions and prompts for every square: " + esc(SITE.shareUrl) : "Instructions and prompts for every square are on the GPD AI Bingo site.") +
      "</p><p><b>" + esc((SITE.responsibleUse || []).join(" ")) + "</b> For internal use.</p></div>";
    pc.innerHTML = h;
  }

  // ---------- Activity view ----------
  function renderActivity(a) {
    document.body.className = "view-activity";
    document.title = a.title + " · GPD AI Bingo";
    var done = !!state.completed[a.slug];
    var idx = playable.indexOf(a.slug);
    var order = LEVEL_ORDER.reduce(function (acc, l) { return acc.concat(activities.filter(function (x) { return x.level === l && cells.indexOf(x.slug) !== -1; }).map(function (x) { return x.slug; })); }, []);
    var oi = order.indexOf(a.slug);
    var prev = bySlug[order[(oi - 1 + order.length) % order.length]];
    var next = bySlug[order[(oi + 1) % order.length]];

    var h = "";
    h += '<header class="activity-top wrap"><a class="back-link" href="#card" id="back-link">' + ICON.back + "Back to the card</a>";
    h += '<div class="chips"><span class="chip level-' + a.level + '">' + pips(a.level) + "Level: " + esc(levelLabel(a.level)) + "</span>" +
      '<span class="chip">Time: ' + esc(a.time) + "</span>" +
      '<span class="chip">' + esc(a.category) + "</span>" +
      (done ? '<span class="chip done-chip">' + "✓ You tried this</span>" : "") + "</div>";
    h += '<h1 class="activity-title" id="activity-title" tabindex="-1">' + esc(a.title) + "</h1>";
    h += '<p class="activity-summary">' + esc(a.summary) + "</p></header>";

    h += '<main id="main" class="wrap"><div class="sheet"><div class="activity-layout"><article class="activity-main">';
    h += section("Why try this?", "<p>" + esc(a.why) + "</p>");
    h += section("What you need", '<ul class="checks">' + li(a.needs) + "</ul>");
    h += section("Try it now",
      '<div class="prompt-box"><div class="prompt-head"><span>Prompt</span><button type="button" class="btn btn-gold btn-small" data-copy="prompt">' + ICON.copy + '<span class="lbl">Copy Prompt</span></button></div>' +
      '<pre class="prompt-text" id="prompt-text" tabindex="0" aria-label="Prompt text">' + esc(a.prompt) + "</pre></div>" +
      '<p class="prompt-note">Paste it into your company-approved AI tool, then fill in anything in [SQUARE BRACKETS].</p>', "try");
    h += section("How it works", '<ol class="steps">' + li(a.steps) + "</ol>");
    if (a.fallback) h += section("No agents or code tools? Try this", '<div class="callout fallback"><p>' + esc(a.fallback) + "</p></div>");
    h += section("What good looks like", "<p>" + esc(a.output) + '</p><ul class="checks" style="margin-top:12px">' + li(a.goodLooksLike) + '</ul><p class="done-when">Done when: ' + esc(a.doneWhen) + "</p>");
    h += section("Go one step further", '<div class="callout"><p>' + esc(a.extension) + "</p></div>");
    h += section("Things to watch for", '<ul class="warn-list">' + li(a.watchFor) + "</ul>");
    h += "</article>";

    h += '<aside class="activity-aside no-print" aria-label="Your progress and tools">';
    h += '<div class="aside-block"><p class="aside-label">At a glance</p><ul class="meta-list"><li><b>Level</b>' + esc(levelLabel(a.level)) + '</li><li><b>Time</b>' + esc(a.time) + '</li><li><b>Category</b>' + esc(a.category) + "</li></ul></div>";
    h += '<div class="aside-block complete-box" id="complete-box">' + completeBox(done) + "</div>";
    h += '<div class="aside-block stack"><p class="aside-label">Take it with you</p>' +
      '<button type="button" class="btn btn-outline-ink" data-copy="full">' + ICON.copy + '<span class="lbl">Copy Full Instructions</span></button>' +
      '<button type="button" class="btn btn-outline-ink" data-copy="prompt">' + ICON.copy + '<span class="lbl">Copy Prompt</span></button></div>';
    h += '<div class="aside-block"><p class="aside-label">More squares</p><div class="prev-next">' +
      '<a href="#' + esc(prev.slug) + '"><small>← Previous</small>' + esc(prev.square) + "</a>" +
      '<a href="#' + esc(next.slug) + '"><small>Next →</small>' + esc(next.square) + "</a></div></div>";
    h += "</aside></div></div></main>";
    h += siteFooter();

    app.innerHTML = h;
    var pc = document.getElementById("print-card"); if (pc) pc.innerHTML = "";
    window.scrollTo(0, 0);
    var t = document.getElementById("activity-title"); if (t) t.focus({ preventScroll: true });

    app.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () { copyText(btn.getAttribute("data-copy") === "full" ? fullInstructions(a) : a.prompt, btn); });
    });
    document.getElementById("back-link").addEventListener("click", function (e) {
      e.preventDefault(); goBoard(a.slug);
    });
    wireComplete(a);
    if (!state.hintDismissed) { state.hintDismissed = true; save(); }
  }
  function section(title, body, id) {
    return '<section class="section"' + (id ? ' id="' + id + '"' : "") + "><h2>" + esc(title) + "</h2>" + body + "</section>";
  }
  function li(arr) { return (arr || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""); }
  function completeBox(done) {
    if (done) {
      return '<div class="complete-status">' + ICON.check + "<span>Stamped! This square is marked complete.</span></div>" +
        '<button type="button" class="btn btn-gold" id="to-card">Back to the card</button>' +
        '<button type="button" class="link-btn" id="undo-complete">Marked by mistake? Undo</button>';
    }
    return '<p class="aside-label">Tried it?</p><button type="button" class="btn btn-ink" id="mark-complete">' + ICON.check + "<span>I tried it — mark complete</span></button>" +
      '<p style="margin:0;font-size:14px;color:var(--ink-soft)">No need to finish perfectly. Trying it counts.</p>';
  }
  function wireComplete(a) {
    var box = document.getElementById("complete-box");
    var mk = document.getElementById("mark-complete");
    var undo = document.getElementById("undo-complete");
    var tc = document.getElementById("to-card");
    if (mk) mk.addEventListener("click", function () {
      var before = completeLines().map(function (l) { return l.key; });
      state.completed[a.slug] = Date.now();
      var after = completeLines();
      var fresh = after.filter(function (l) { return before.indexOf(l.key) === -1 && state.celebrated.indexOf(l.key) === -1; });
      fresh.forEach(function (l) { state.celebrated.push(l.key); });
      save();
      justStamped = a.slug;
      box.innerHTML = completeBox(true); wireComplete(a);
      var chips = document.querySelector(".chips");
      if (chips && !chips.querySelector(".done-chip")) chips.insertAdjacentHTML("beforeend", '<span class="chip done-chip">✓ You tried this</span>');
      document.getElementById("to-card").focus();
      if (fresh.length) celebrate(fresh);
      else toast("Stamped! " + doneCount() + " of " + playable.length + " tried.", { href: "#card", label: "See your card" });
    });
    if (undo) undo.addEventListener("click", function () {
      delete state.completed[a.slug];
      var stillDone = completeLines().map(function (l) { return l.key; });
      state.celebrated = state.celebrated.filter(function (k) { return stillDone.indexOf(k) !== -1; });
      save();
      box.innerHTML = completeBox(false); wireComplete(a);
      var dc = document.querySelector(".done-chip"); if (dc) dc.remove();
      document.getElementById("mark-complete").focus();
      toast("Stamp removed.");
    });
    if (tc) tc.addEventListener("click", function () { goBoard(a.slug); });
  }
  function goBoard(slug) {
    returnFocusSlug = slug;
    if (location.hash && location.hash !== "#card") location.hash = "card";
    else route();
  }

  function renderNotFound(slug) {
    document.body.className = "view-activity";
    app.innerHTML = '<main id="main" class="wrap not-found"><p class="eyebrow">Hmm</p><h1 class="activity-title">That square isn’t on this card.</h1>' +
      '<p class="activity-summary">There’s no activity called “' + esc(slug) + "”. It may have been renamed.</p>" +
      '<p style="margin-top:20px"><a class="btn btn-gold" href="#card">Back to the card</a></p></main>' + siteFooter();
  }

  // ---------- Celebration ----------
  function celebrate(lines) {
    clearTimeout(toastTimer); toastEl.hidden = true;
    var dlg = document.getElementById("bingo-dialog");
    if (!dlg) { dlg = document.createElement("dialog"); dlg.className = "modal"; dlg.id = "bingo-dialog"; dlg.setAttribute("aria-labelledby", "bingo-title"); document.body.appendChild(dlg); }
    var items = [];
    lines.forEach(function (l) { l.idx.forEach(function (i) { var s = cells[i]; if (s !== FREE && bySlug[s] && items.indexOf(s) === -1) items.push(s); }); });
    dlg.innerHTML = '<div class="modal-body"><p class="bingo-word" id="bingo-title">BINGO<span>!</span></p>' +
      "<h2>" + esc(SITE.bingoMessage) + "</h2>" +
      "<p>" + esc(lines.map(function (l) { return lineName(l.key); }).join(" and ")) + " complete:</p>" +
      '<ul class="bingo-list">' + items.map(function (s) { return "<li>" + esc(bySlug[s].title) + "</li>"; }).join("") + "</ul>" +
      '<p style="margin-top:14px">There’s no finish line. Keep going whenever something catches your eye.</p>' +
      '<div class="modal-actions"><button type="button" class="btn btn-outline-ink" id="bingo-stay">Stay here</button><button type="button" class="btn btn-ink" id="bingo-card">Back to my card</button></div></div>';
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    document.getElementById("bingo-card").focus();
    document.getElementById("bingo-stay").addEventListener("click", function () { dlg.close(); });
    document.getElementById("bingo-card").addEventListener("click", function () { dlg.close(); goBoard(currentSlug()); });
    confetti();
  }
  function confetti() {
    if (reduceMotion) return;
    var cv = document.getElementById("confetti"); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d"), dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.scale(dpr, dpr);
    var colors = ["#f2bf5e", "#f7f1e3", "#17766d", "#5b4bc4", "#a3376a", "#e0a43a"];
    var parts = [];
    for (var i = 0; i < 160; i++) parts.push({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 13 - 4, s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: colors[i % colors.length], round: Math.random() < .3 });
    var start = performance.now();
    (function frame(t) {
      var el = t - start; ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(function (p) {
        p.vy += .38; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.globalAlpha = Math.max(0, 1 - el / 2600); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, 6.283); ctx.fill(); } else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      });
      if (el < 2600) requestAnimationFrame(frame); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(start);
  }

  // ---------- Start ----------
  window.addEventListener("hashchange", function () {
    if (currentSlug() === "main" && document.body.className === "view-board") {
      var m = document.getElementById("main"); if (m) m.focus(); return;
    }
    route();
  });
  // Expose a tiny read-only hook for automated tests.
  window.GPD_BINGO = { lines: function () { return completeLines().map(function (l) { return l.key; }); }, state: function () { return JSON.parse(JSON.stringify(state)); } };
  route();
})();
