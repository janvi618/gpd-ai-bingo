/* =====================================================================
   GPD AI BINGO: CONTENT FILE
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to change what the site says.

   How to edit safely:
   - Change text between the quotes "like this" or between the
     backticks of a prompt `like this`.
   - Don't use a backtick ( ` ) inside a prompt.
   - Keep the commas at the end of each line and each { } block.
   - To swap a challenge: edit its fields below, or replace the whole
     { ... } block and put its slug into the "board" layout.
   - After saving, refresh the page. If something is wrong, the site
     shows a red message at the top explaining what to fix.

   Levels:  "explore" (beginner) · "levelup" (intermediate) ·
            "gofurther" (advanced)
   ===================================================================== */

window.BINGO = {

  /* ---------- Words on the main page ---------- */
  site: {
    eyebrow: "Inspired by Feedforward",
    headline: "What’s something you haven’t tried with AI yet?",
    subhead: "From quick wins to ambitious experiments, there’s something here for everyone. Pick a square and give it a try.",
    cardKicker: "Global Product Design",
    cardTitle: "GPD AI BINGO",
    instruction: "Choose a square. Try the challenge. Mark it complete. Five in a row is Bingo!",
    stickyNote: "Try one square.",
    firstTimeHint: "Tap a square to see how to try it.",
    bottomMessage: "Start anywhere. One square is a win.",
    responsibleUse: ["Use approved AI tools.", "Protect confidential information.", "Review AI outputs."],
    bingoMessage: "Look what you’ve explored.",
    // The site's real, hosted link. It's turned into the QR code in the
    // FREE SPACE (on screen and on the printed card) and printed on the card.
    // Change it if the site moves. Leave empty ("") to show no QR code.
    shareUrl: "https://janvi618.github.io/gpd-ai-bingo/"
  },

  /* ---------- The three levels ---------- */
  levels: {
    explore:   { label: "Explore",    pickerLabel: "Just getting started",           blurb: "Quick wins, about 5–10 minutes" },
    levelup:   { label: "Level Up",   pickerLabel: "Ready to level up",              blurb: "AI as a thinking partner, 10–25 minutes" },
    gofurther: { label: "Go Further", pickerLabel: "Show me something ambitious",    blurb: "New ways of working, 20–60 minutes" }
  },

  /* ---------- Board layout (5 rows x 5 columns) ----------
     Each entry is an activity "slug" from the list below. "FREE" is the
     free space. The middle row is all Explore squares, so anyone can get
     Bingo with four quick wins. */
  board: [
    ["messy-notes",      "poke-holes",        "three-expert-panel", "ai-interviews-you",        "one-minute-brief"],
    ["doc-to-visual", "meeting-prep",      "idea-scorecard",     "workflow-redesign",       "skeptic-rehearsal"],
    ["kinder-email",     "explain-it-twice",  "FREE",               "end-boring",          "scary-task-checklist"],
    ["feedback-to-experiments", "ten-minute-training", "feedback-growth-plan", "fridge-dinner",   "research-head-start"],
    ["devils-advocate",      "learning-plan", "blind-taste-test-for-ai", "process-one-pager", "self-critique-loop"]
  ],

  /* ---------- The 24 activities ----------
     Fields: id, slug (used in the page link), level, square (short text on
     the card), title, category, time, summary, why, needs[], prompt,
     steps[], output, goodLooksLike[], doneWhen, extension, watchFor[],
     fallback (optional: a basic-chat alternative for advanced squares). */
  activities: [

    /* ===== EXPLORE (beginner) ===== */
    {
        id: "b1",
        slug: "messy-notes",
        level: "explore",
        square: "Turn messy notes into 3 clear actions.",
        title: "Turn messy notes into 3 clear actions",
        category: "Everyday work",
        time: "5–10 min",
        summary: "Paste a jumble of notes from a meeting, a bench session or a hallway chat, and get back three clear, owned next steps.",
        why: "Most notes are written in a hurry and read later by someone who has forgotten the context, often you. AI is surprisingly good at spotting the decisions and to-dos hiding in half-sentences. It also shows you what’s missing, like an owner or a date nobody actually agreed on.",
        needs: [
          "Your company-approved AI chat tool",
          "A set of rough notes (typed, or copied from a photo of a notepad)",
          "Remove confidential details or use a made-up example unless your tool is approved for that information."
        ],
        prompt: `You are a sharp, practical project coordinator. I’m going to paste some messy notes. Please turn them into exactly 3 clear actions.

For each action, give me:
1. The action, starting with a verb, in one sentence
2. Who owns it (only if the notes say so; otherwise write "Owner: not stated")
3. When it’s due (only if the notes say so; otherwise write "Due: not stated")
4. Why it matters, in one short line

Rules:
- Do not invent names, dates or numbers. If something is unclear, say so.
- If there are more than 3 possible actions, pick the 3 that matter most and list the rest under "Also mentioned".
- After the actions, list up to 2 questions I should answer to make these notes complete.

Here are my notes:
[PASTE YOUR NOTES HERE]

When you’re done, ask me whether any action should be reworded or swapped out.`,
        steps: [
          "Grab notes from a recent meeting or working session and remove anything confidential.",
          "Paste the prompt into your AI chat tool, add your notes where it says [PASTE YOUR NOTES HERE], and send.",
          "Read the 3 actions and check them against what actually happened. You were there; the AI wasn’t.",
          "Answer the AI’s follow-up questions or ask it to swap an action you think matters more.",
          "Copy the final version into an email, chat message or your own to-do list."
        ],
        output: "A short list of three specific, owned next steps you can share or act on today.",
        goodLooksLike: [
          "Each action starts with a verb and could be done by one person",
          "Owners and dates come from your notes, not from the AI’s imagination",
          "Gaps are flagged as “not stated” instead of filled in",
          "Someone who missed the meeting would understand what happens next"
        ],
        doneWhen: "You’ve sent or saved three actions you’d be comfortable putting your name to.",
        extension: "Ask for a ready-to-send follow-up message: “Turn these 3 actions into a friendly 4-sentence recap email to the group.”",
        watchFor: [
          "AI can confidently assign an owner who was never named. Check every name and date.",
          "It may miss tone or politics that were obvious in the room, so read with that in mind.",
          "Keep confidential project names, formulas and personal details out unless your tool is approved for them."
        ]
      },
      {
        id: "b2",
        slug: "kinder-email",
        level: "explore",
        square: "Cut an email in half. Keep it kind.",
        title: "Cut an email in half and keep it kind",
        category: "Communication",
        time: "5–10 min",
        summary: "Take a long draft email and have AI trim it to half the length without losing the warmth or the point.",
        why: "Shorter emails get read and answered faster, but cutting your own writing is hard because every sentence feels necessary. AI has no attachment to your words, so it can trim quickly. The trick is asking it to protect the tone, which it does better than most people expect.",
        needs: [
          "Your company-approved AI chat tool",
          "A draft email you’ve written, or one you’re about to write",
          "Remove confidential details or use a made-up example unless your tool is approved for that information."
        ],
        prompt: `You are a thoughtful editor who writes clear, warm workplace emails. Please shorten the email below to about half its current length.

Keep:
- The main request or message
- Any deadline or decision that’s already in the email
- A friendly, respectful tone (no curt one-liners)

Cut:
- Repetition, long wind-ups and over-apologizing
- Background the reader probably already knows

Give me 2 versions:
1. Half the length, same warmth
2. Even shorter, for someone reading on their phone

Do not add facts, dates or commitments that aren’t in my draft. If something seems unclear or might land badly, point it out after the versions.

My draft:
[PASTE YOUR EMAIL HERE]

Who it’s going to and our relationship (optional): [E.G., MY MANAGER, A CROSS-FUNCTIONAL PARTNER I DON’T KNOW WELL]

Then ask me which version I’d like to refine.`,
        steps: [
          "Pick a real email draft that feels too long. Strip out anything confidential.",
          "Paste the prompt into your AI chat tool, add your draft and who it’s going to, and send.",
          "Compare the two versions with your original. Decide which one sounds most like you.",
          "Tweak a phrase or two yourself, or ask the AI to adjust (for example, “a bit warmer” or “keep the thank-you line”).",
          "Send it, or save it as a template for the next time you write something similar."
        ],
        output: "A shorter, friendlier version of your email that still says everything that matters.",
        goodLooksLike: [
          "Roughly half the words, with the ask easy to find in the first two lines",
          "It still sounds like you, not like a press release",
          "Nothing new was added that you didn’t say",
          "The reader knows exactly what you need from them"
        ],
        doneWhen: "You’ve sent (or saved) a version you’d actually use.",
        extension: "Try it in reverse on an email you received: “Summarize this email in 2 lines and suggest a short, kind reply.”",
        watchFor: [
          "Shorter can sometimes read as colder. Reread it as the recipient would.",
          "AI may quietly drop a detail you needed, like a deadline or a thank-you. Check before sending.",
          "Don’t paste in other people’s personal information or confidential threads unless your tool is approved for that."
        ]
      },
      {
        id: "b3",
        slug: "explain-it-twice",
        level: "explore",
        square: "Explain a tricky topic to a 10-year-old, then a CFO.",
        title: "Explain one tricky topic to a 10-year-old, then a CFO",
        category: "Communication",
        time: "5–10 min",
        summary: "Pick a topic you know well and have AI explain it two ways: once for a curious kid and once for a busy finance leader.",
        why: "The same idea lands very differently depending on who’s listening, and seeing both versions side by side sharpens your own thinking. The kid version strips out jargon; the CFO version forces you to say why it matters in money, risk or time. Many people find a phrase in one of them they end up using for real.",
        needs: [
          "Your company-approved AI chat tool",
          "A topic you understand, such as why a cereal goes stale, what a shelf-life study is, or something from your own job",
          "Use general, public-level knowledge or a made-up example; keep confidential project details out."
        ],
        prompt: `You are an excellent explainer who can adjust to any audience. I want you to explain the same topic twice.

Topic: [YOUR TOPIC, E.G., WHY A CEREAL GOES STALE, OR WHAT A SHELF-LIFE STUDY IS]
A bit of context from me (optional): [ANYTHING YOU WANT INCLUDED]

Version 1: For a curious 10-year-old. Use everyday comparisons, short sentences and no jargon. About 100 words.

Version 2: For a CFO with 60 seconds. Lead with why it matters for cost, risk, speed or growth. Use 3 short bullet points and one sentence on what decision it might inform.

Rules:
- Keep the science accurate. If you’re unsure about a fact, say so instead of guessing.
- Don’t make up numbers, costs or statistics. If a number would help, write [NUMBER NEEDED] so I can fill it in.

After both versions, tell me which idea appears in both, since that’s probably the core message. Then ask me if I want a third version for a different audience.`,
        steps: [
          "Choose a topic. Something you explain often, or something you’ve always found hard to explain, works best.",
          "Paste the prompt into your AI chat tool, fill in the topic, and send.",
          "Check both versions for accuracy. You’re the expert here, so correct anything that’s off.",
          "Notice the core message the AI pulled out. Do you agree it’s the heart of the topic?",
          "Save the version (or the phrase) you’d actually use in your next conversation."
        ],
        output: "Two ready-to-use explanations of the same topic, plus the one core message they share.",
        goodLooksLike: [
          "The kid version uses a comparison you’d never have thought of but instantly gets",
          "The CFO version says why it matters in the first line",
          "No invented numbers; gaps are marked for you to fill",
          "Both versions are scientifically correct as far as you can tell"
        ],
        doneWhen: "You’ve found at least one line you’d happily use when explaining this topic to someone real.",
        extension: "Add a third audience: “Now explain it to a new teammate from Marketing who will present it to a retailer.”",
        watchFor: [
          "Simplified explanations can drift into wrong ones. Check the science yourself.",
          "AI may invent cost figures or percentages to sound convincing to a CFO. Remove any you can’t verify.",
          "Keep unpublished project details, formulas and results out unless your tool is approved for them."
        ]
      },
      {
          id: "b4",
          slug: "end-boring",
          level: "explore",
          square: "End Boring your next presentation.",
          title: "End Boring your next presentation",
          category: "Communication",
          time: "5–10 min",
          summary: "Run your next presentation through Ivan Wanis Ruiz’s End Boring ideas: clear walkaways, visceral statements, a stronger opening, less slide text and a quick out-loud rehearsal.",
          credit: "Based on End Boring: A Tactical Approach to Public Speaking and Communication by Ivan Wanis Ruiz.",
          why: "GPD went through Ivan Wanis Ruiz’s End Boring training: “A Tactical Approach to Public Speaking and Communication.” Ivan’s starting point is that audiences remember very little, so you decide your one to three walkaways first and say each as a short, visceral statement. He suggests opening with something more interesting than your name and topic, using an occasional two- or three-word slide as a memory anchor (his Public Speaking Lab calls this the “One, Two, Three” method), and keeping the focus on you rather than your slides. He also practices by shrinking a talk to one sentence and to 30 seconds, then rehearsing out loud. AI can apply all of that to your next presentation in a few minutes.",
          needs: [
            "Your company-approved AI chat tool",
            "A presentation you’re giving soon: its topic, audience and length, plus the outline or slide titles",
            "Optional: your own notes from the End Boring session",
            "Remove confidential details or use a made-up example unless your tool is approved for that information."
          ],
          prompt: `You are a presentation coach using Ivan Wanis Ruiz’s End Boring approach. Review my presentation and label each part of your answer with the End Boring idea it uses.

My presentation:
Topic: [WHAT IT’S ABOUT]
Audience: [WHO WILL BE THERE]
Length: [E.G., 10 MINUTES]
Outline or slide titles: [PASTE THEM]
My End Boring notes: [OPTIONAL: ANYTHING YOU REMEMBER FROM THE SESSION]

Give me:
1. WALKAWAYS: the one to three things the audience should remember. If my outline has more, tell me what to cut.
2. VISCERAL STATEMENTS: one short, vivid sentence for each walkaway, not a topic label.
3. OPENING: two openings that don’t start with my name and topic, such as a question or a surprising statement that leads into the first walkaway.
4. ONE, TWO, THREE: where a slide with only 2–3 words would work as a memory anchor, and the words.
5. 70/30: which slides are doing too much talking, and what to say out loud instead.
6. PRACTICE: my talk in one sentence, then a 30-second version I can rehearse out loud.

Use only facts and numbers I gave you, and don’t add End Boring ideas beyond these and my notes. Then ask which part I want to work on first.`,
          steps: [
            "Pick a presentation you’re giving in the next few weeks. Real stakes make it easier to judge the suggestions.",
            "Paste the prompt into your approved AI tool, add your outline or slide titles, and send.",
            "Check the walkaways. Are those really the one to three things you want people to leave with? You know the room and the goal; adjust them before anything else.",
            "Choose an opening and the visceral statements that sound like you, and say them out loud. Drop anything that feels forced.",
            "Make the slide changes, then rehearse the 30-second version out loud once before your full run-through."
          ],
          output: "Your next presentation reworked the End Boring way: clear walkaways, visceral statements, a stronger opening, leaner slides and a 30-second version you’ve said out loud.",
          goodLooksLike: [
            "You can say your walkaways in one breath, and there are no more than three",
            "Your opening would make someone look up from their laptop",
            "At least one slide has less text because you’ll say it instead",
            "You’ve rehearsed the 30-second version out loud, not just read it"
          ],
          doneWhen: "You’ve chosen your walkaways and opening, updated at least one slide, and said the 30-second version out loud.",
          extension: "Ask for a live rehearsal: “I’ll type my opening and first walkaway the way I’d say them. Play a distracted audience member and tell me the moment you’d stop listening, and why.”",
          watchFor: [
            "The AI knows only the End Boring ideas listed in the prompt and your notes. Don’t trust it to describe the rest of the training.",
            "A visceral statement can overclaim. Make sure your data supports every line.",
            "Some audiences, like a leadership review, may want plain and precise over punchy. You know the room.",
            "Don’t paste unpublished results or confidential project details unless your tool is approved for them."
          ]
      },
      {
          id: "b5",
          slug: "one-minute-brief",
          level: "explore",
          square: "Turn a long read into a one-minute brief.",
          title: "Turn a long read into a one-minute brief",
          category: "Everyday work",
          time: "5–10 min",
          summary: "Hand AI a long article, report or document and get back a short brief: what it says, why it matters to you, what to do and what’s still uncertain.",
          why: "Long reads pile up, and the ones that matter most often get skimmed the least. A short brief in a fixed shape helps you decide quickly whether to read the whole thing, and what to look for when you do. Asking what’s uncertain keeps the summary honest, and follow-up questions turn it into a conversation instead of a shortcut.",
          needs: [
            "Your company-approved AI chat tool",
            "A long document, article or report: something public, or something your tool is approved for",
            "Ten minutes to check the brief against the original",
            "Don’t paste confidential General Mills documents unless your tool is approved for that information."
          ],
          prompt: `You are a clear, careful analyst who writes short briefs for busy people. Turn the long document below into a brief I can read in one minute.

About me: [YOUR ROLE AND WHAT YOU CARE ABOUT, E.G., A FOOD SCIENTIST WORKING ON SNACK TEXTURE]
The document: [PASTE THE TEXT OF A PUBLIC ARTICLE OR REPORT, OR ONE YOUR TOOL IS APPROVED FOR]

Use this format, about 150 words in total:
1. What it says: 3 bullet points
2. Why it matters to me: 1–2 sentences, based on what I told you about my role
3. What I might do: up to 2 suggestions
4. What’s uncertain: anything the document leaves open, hedges on or doesn’t support well

Rules:
- Only use what’s in the document. Don’t add facts, numbers, names or sources.
- For each key number or claim, tell me roughly where it appears (section or heading) so I can check it.
- If the document was too long to read in full, say so.

Then suggest 3 follow-up questions I could ask you about it.`,
          steps: [
            "Pick a long read that’s been sitting in your inbox or browser tabs. Public articles and reports are perfect for practice.",
            "Paste the prompt into your AI chat tool, add a line about your role and the document text, and send.",
            "Spot-check the brief against the original, especially numbers and anything in “What I might do.” You decide what’s worth acting on.",
            "Ask one or two of the follow-up questions, or your own, to dig into the part that matters most to you."
          ],
          output: "A one-minute brief you can read, forward or file, plus a couple of questions worth exploring.",
          goodLooksLike: [
            "The brief fits on one screen and takes about a minute to read",
            "Every number and claim can be found in the original",
            "“What’s uncertain” names real gaps, not just generic caveats",
            "“Why it matters to me” actually connects to your work"
          ],
          doneWhen: "You’ve checked the brief against the source and decided whether to read the full document, act on it or let it go.",
          extension: "Turn the brief into a note for your team: “Rewrite this as a 4-sentence message for my team, with one question for discussion.”",
          watchFor: [
            "Summaries can drop or distort nuance, such as a caveat, a small sample or an “only in some cases.” Check against the source before you rely on it.",
            "AI may invent details, numbers or quotes that aren’t in the document. If you can’t find it in the original, don’t repeat it.",
            "Don’t paste confidential General Mills documents, formulas or unpublished plans unless your tool is approved for them."
          ]
      },
      {
        id: "b6",
        slug: "meeting-prep",
        level: "explore",
        square: "Prep for your next meeting in 5 minutes.",
        title: "Prep for your next meeting in 5 minutes",
        category: "Everyday work",
        time: "5–10 min",
        summary: "Give AI the basics about an upcoming meeting and get back a one-page prep sheet: your goal, key points, likely questions and a smart ask.",
        why: "Walking into a meeting with a clear goal and a couple of good questions changes how it goes, but prep often gets squeezed out. AI can turn a few lines of context into a focused prep sheet in moments. The likely-questions list is the part people tend to find most useful.",
        needs: [
          "Your company-approved AI chat tool",
          "Basic details about an upcoming meeting: purpose, who’s attending (by role is fine), what you want out of it",
          "Remove confidential details or use a made-up example unless your tool is approved for that information."
        ],
        prompt: `You are a calm, well-organized chief of staff helping me prepare for a meeting.

Meeting details:
- Purpose of the meeting: [E.G., PROJECT CHECK-IN, DECISION ON NEXT STEPS, FIRST INTRO]
- Who’s attending (roles are fine): [E.G., MY MANAGER, A SUPPLY CHAIN PARTNER, TWO SCIENTISTS]
- My role in it: [E.G., PRESENTING, ASKING FOR HELP, LISTENING]
- What I want to walk out with: [YOUR GOAL]
- Anything I’m nervous about (optional): [E.G., PUSHBACK ON TIMING]

Please create a one-page prep sheet with:
1. My goal, in one sentence
2. The 3 points I most need to land
3. 4 questions others might ask me, with a short suggested answer for each
4. 2 good questions I could ask them
5. A one-sentence closing ask

Rules:
- Only use details I’ve given you. Where you’d need more information, write [ADD DETAIL] rather than guessing.
- Ask me up to 2 clarifying questions first if something important is missing.

Afterwards, ask whether I want a shorter version I can glance at on my phone.`,
        steps: [
          "Pick a meeting in the next day or two.",
          "Paste the prompt into your AI chat tool, fill in the details, and send. Answer any clarifying questions it asks.",
          "Review the likely questions and rewrite the suggested answers in your own words. You know the real facts and relationships.",
          "Fill in any [ADD DETAIL] gaps yourself.",
          "Keep the sheet open or printed for the meeting."
        ],
        output: "A one-page prep sheet with your goal, key points, likely questions, smart questions to ask and a clear closing ask.",
        goodLooksLike: [
          "Your goal fits in one sentence",
          "At least one likely question is something you hadn’t prepared for",
          "Suggested answers are honest and don’t promise anything you haven’t agreed to",
          "It fits on one page or one phone screen"
        ],
        doneWhen: "You walk into your meeting with a prep sheet you actually looked at.",
        extension: "After the meeting, paste your quick notes back in and ask: “Based on my prep sheet and these notes, what did I achieve and what follow-ups do I owe?”",
        watchFor: [
          "AI doesn’t know the people or history involved. Adjust for relationships and context only you know.",
          "Suggested answers may sound confident but be wrong about your project. Use them as a draft.",
          "Avoid pasting colleagues’ personal details, confidential agendas or unpublished plans unless your tool is approved for them."
        ]
      },
      {
        id: "b7",
        slug: "scary-task-checklist",
        level: "explore",
        square: "Shrink a big, scary task into a checklist.",
        title: "Shrink a big, scary task into a checklist",
        category: "Everyday work",
        time: "5–10 min",
        summary: "Describe a task you’ve been putting off and have AI break it into small, doable steps with a first move you can make today.",
        why: "Big tasks feel heavy mostly because the first step is unclear. AI is good at breaking work into bite-sized pieces and putting them in a sensible order. Seeing a 15-minute first step is often all it takes to get moving.",
        needs: [
          "Your company-approved AI chat tool",
          "A task you’ve been avoiding, at work or at home",
          "A rough sense of your deadline, if there is one"
        ],
        prompt: `You are a supportive, practical coach who helps people get started on big tasks.

The task I’ve been putting off: [DESCRIBE THE TASK, E.G., WRITE THE PROJECT SUMMARY FOR MY YEAR-END REVIEW]
Deadline (if any): [DATE OR "NONE"]
What’s making it feel hard: [E.G., DON’T KNOW WHERE TO START, NEED INPUT FROM OTHERS, IT’S JUST BIG]
Time I can realistically give it each day: [E.G., 20 MINUTES]

Please turn this into a checklist:
1. Break it into 6 to 10 small steps, each doable in 30 minutes or less
2. Put them in a sensible order
3. Mark the single easiest first step I can do today in 15 minutes
4. Note any step where I’ll need something from someone else
5. If there’s a deadline, suggest a simple schedule

Don’t assume details about my job that I haven’t shared. If you need to know more, ask me up to 2 questions first.

Then ask me if any step still feels too big, so we can split it further.`,
        steps: [
          "Name the task you’ve been avoiding. Be honest about why it feels hard.",
          "Paste the prompt into your AI chat tool, fill in the brackets, and send.",
          "Look at the order and the step sizes. Move, merge or delete steps based on what you know about the real work.",
          "Ask the AI to split any step that still feels too big.",
          "Do the 15-minute first step right now, then copy the checklist somewhere you’ll see it."
        ],
        output: "A short, ordered checklist with a clearly marked first step you can do today.",
        goodLooksLike: [
          "Every step starts with a verb and feels doable in one sitting",
          "The first step is genuinely easy, not just smaller",
          "Dependencies on other people are called out",
          "You feel a little lighter looking at it"
        ],
        doneWhen: "You’ve checked off the first step.",
        extension: "Ask the AI to be your accountability buddy: “Write me a 2-line note to send myself at the end of the week asking how far I got and what’s blocking me.”",
        watchFor: [
          "AI doesn’t know your workload or organization. Its time estimates are guesses, so adjust them.",
          "A tidy checklist can hide a real blocker, like a decision someone else needs to make. Flag those early.",
          "If the task involves confidential projects, describe it in general terms or use a made-up example unless your tool is approved for that information."
        ]
      },
      {
        id: "b8",
        slug: "fridge-dinner",
        level: "explore",
        square: "Plan tonight's dinner from what's in your fridge.",
        title: "Plan tonight’s dinner from what’s in your fridge",
        category: "Just for fun",
        time: "5–10 min",
        summary: "Tell AI what’s in your fridge (or show it a photo, if your tool accepts images) and get three realistic dinner ideas for tonight.",
        why: "It’s a low-stakes, genuinely useful way to see how AI handles messy, real-world information. You’ll notice how well it adapts to constraints like time, picky eaters or one sad zucchini. And you might just save a trip to the store.",
        needs: [
          "Your company-approved AI chat tool",
          "A list of what’s in your fridge and pantry, or a photo of your fridge if your tool accepts images",
          "Any dietary needs, allergies or time limits for tonight"
        ],
        prompt: `You are a friendly, practical home cook who is great at making dinner from whatever is on hand.

Here’s what I have: [TYPE YOUR LIST, OR SAY "SEE ATTACHED PHOTO" AND ATTACH A FRIDGE PHOTO]
Pantry basics I can assume (optional): [E.G., OIL, SALT, PASTA, RICE, SPICES]
Who’s eating: [E.G., 2 ADULTS AND A PICKY 7-YEAR-OLD]
Allergies or dietary needs: [LIST THEM, OR "NONE"]
Time I have: [E.G., 30 MINUTES]

Please suggest 3 dinner ideas:
1. One super easy
2. One a little more interesting
3. One that uses up whatever is most likely to go bad first

For each, give a name, the ingredients from my list it uses, any 1 or 2 extra items I might need, and short step-by-step instructions.

If you’re working from a photo, first list what you think you see and tell me which items you’re unsure about, so I can correct you. Don’t assume I have anything I didn’t mention.

Then ask me which one I’m making so you can adjust it.`,
        steps: [
          "Open your fridge and either type a quick list or snap a photo (if your AI tool accepts images).",
          "Paste the prompt into your AI chat tool, fill in who’s eating, allergies and time, and send.",
          "If you used a photo, check the AI’s list of what it sees and correct anything it got wrong.",
          "Pick the idea that fits your night and ask the AI to tweak it, for example “make it kid-friendly” or “no oven”.",
          "Cook it, and use your own kitchen sense on cooking times, temperatures and whether something’s still good."
        ],
        output: "Three realistic dinner ideas built around what you already have, with simple instructions for the one you choose.",
        goodLooksLike: [
          "The ideas mostly use ingredients you actually have",
          "Allergies and time limits are respected",
          "Instructions are short enough to follow while cooking",
          "At least one idea is something you wouldn’t have thought of"
        ],
        doneWhen: "You’ve made (or at least decided on) dinner using one of the ideas.",
        extension: "Turn it into a habit: “Based on what I didn’t use tonight, suggest 2 more dinners for this week and a short shopping list.”",
        watchFor: [
          "AI can misread a photo, like mistaking one jar for another. Always check its list.",
          "Use your own judgment on food safety: whether something is still fresh, and safe cooking temperatures.",
          "Double-check every idea against allergies yourself, especially for guests or kids.",
          "Fridge photos can show more than food, like notes or calendars. Crop out anything personal before sharing."
        ]
      },

    /* ===== LEVEL UP (intermediate) ===== */
    {
        id: "i1",
        slug: "poke-holes",
        level: "levelup",
        square: "Ask AI to poke holes in your favorite idea.",
        title: "Find the cracks before someone else does",
        category: "Critical thinking",
        time: "15–20 min",
        summary: "Have AI surface the hidden assumptions under an idea you love, then rank them by how risky and how uncertain each one is.",
        why: "The ideas we like most are the ones we question least. A structured critique from a patient, unbothered partner helps you see which beliefs are carrying the whole idea. You walk away knowing what to check first instead of defending everything at once.",
        needs: [
          "Your company-approved AI chat tool",
          "An idea you’re genuinely excited about, described in 2–3 sentences (use a hypothetical or sanitized version if it’s confidential)",
          "A few minutes of honesty with yourself"
        ],
        prompt: `You are an experienced innovation strategist and a constructive critic. Your job is to help me find the hidden assumptions in an idea I care about, not to tear it down for sport.

My idea: [DESCRIBE YOUR IDEA IN 2–3 SENTENCES, HYPOTHETICAL OR SANITIZED]
Who it’s for: [TARGET CONSUMER OR CUSTOMER]
Why I believe in it: [YOUR TOP 1–2 REASONS]

Work with me in stages:
1. First, ask me 3 clarifying questions that would most change your critique. Wait for my answers.
2. Then list 8–10 assumptions the idea depends on. Cover the consumer, the product or technology, operations and supply, the business case, and the organization. Label each one as “stated by me” or “implied.”
3. Score each assumption 1–5 for risk (how bad if it’s wrong) and 1–5 for uncertainty (how little we actually know). Show a table with columns: Assumption | Risk | Uncertainty | Risk × Uncertainty | Why you scored it this way.
4. Sort the table from highest to lowest score and name the top 3 as “check these first.” For each, suggest one quick way to learn more.

Rules: Don’t invent statistics, studies or sources. If you rely on general knowledge, say so and mark it as an assumption, not a fact. Flag anything that needs a food safety, regulatory, nutrition or legal expert to judge. After the table, ask me which scores I disagree with and adjust if my reasoning holds up.`,
        steps: [
          "Write a short, sanitized description of your idea and paste it into the bracketed spots in the prompt.",
          "Answer the AI’s three clarifying questions candidly, including the parts you’re less sure about.",
          "Review the assumption table and challenge at least two scores. Your judgment of what’s actually known matters more than the AI’s first guess.",
          "Decide which of the top three assumptions you’ll check this week, and who you’d ask."
        ],
        output: "A ranked table of the assumptions behind your idea, with the three riskiest and least certain flagged for checking first.",
        goodLooksLike: [
          "At least one assumption surprised you or was one you hadn’t written down anywhere",
          "Scores reflect your pushback, not just the AI’s first pass",
          "Each top assumption has a concrete, quick way to learn more",
          "Facts and assumptions are clearly separated"
        ],
        doneWhen: "You have a sorted assumption table and have picked one assumption to test first.",
        extension: "Ask the AI to argue the strongest case for your idea using the same assumptions: “Now steelman it. Which of these assumptions, if true, would make this idea a big win?”",
        watchFor: [
          "AI may sound confident about markets or consumers without evidence; treat its claims as hypotheses",
          "Risk and uncertainty scores are judgment calls, so don’t present them as measured data",
          "Use only company-approved AI tools and keep unpublished innovation plans out of the chat",
          "Product, claims and ingredient ideas still need food safety, regulatory, nutrition and legal review"
        ]
      },
      {
          id: "i2",
          slug: "ai-interviews-you",
          level: "levelup",
          square: "Let AI interview you until your thinking is clear.",
          title: "Let AI interview you until your thinking is clear",
          category: "Critical thinking",
          time: "10–20 min",
          summary: "Flip the usual direction: the AI asks you questions, one at a time, about a fuzzy project or decision, then plays back a crisp summary, open questions and a next step.",
          why: "Most of the time we ask AI for answers. Sometimes what we need is a good question. Being interviewed by a patient, curious partner helps you put half-formed thoughts into words and notice what you haven’t decided yet. The thinking stays yours; the AI just keeps asking until it’s clear.",
          needs: [
            "Your company-approved AI chat tool",
            "A project, goal or decision that feels fuzzy (describe it in general terms if it’s confidential)",
            "15 quiet minutes to answer honestly"
          ],
          prompt: `You are a calm, curious thinking partner. I have a project, goal or decision that feels fuzzy, and I want you to interview me until my thinking is clear. You ask the questions; I do the thinking.

The topic: [ONE OR TWO SENTENCES, E.G., “HOW TO SET UP OUR TEAM’S SHELF-LIFE TESTING NEXT YEAR” OR “WHETHER TO TAKE ON A STRETCH ASSIGNMENT”]
What would help most: [E.G., A CLEAR GOAL, A DECISION, A PLAN I CAN EXPLAIN TO MY MANAGER]

How to run the interview:
1. Ask me one question at a time, then wait for my answer. Never ask two questions at once.
2. Start broad (what I’m trying to achieve and why it matters now), then get specific (who’s involved, constraints, what I already know, what worries me, what “done” looks like).
3. Build on my answers. If I’m vague, ask a gentle follow-up. If I contradict myself, point it out kindly and ask which I mean.
4. Don’t give advice or opinions during the interview.
5. After 8–12 questions, or when I type WRAP UP, stop and give me:
- A one-paragraph summary of my thinking in plain language, using my words where possible
- Open questions: up to 5 things I still don’t know or haven’t decided
- One next step I could take this week, phrased as an action
- Anything I mentioned that seemed important but I didn’t follow through on

Rules: Only reflect what I actually told you. Don’t invent facts, names, numbers or deadlines. If the summary includes your own interpretation, label it. Then ask me what you got wrong and revise until it sounds like me.`,
          steps: [
            "Pick something that’s been on your mind but isn’t yet clear: a project, a goal or a decision. Keep confidential details general.",
            "Paste the prompt, fill in the topic, and answer each question as honestly as you would with a trusted colleague.",
            "Type WRAP UP when you feel ready, or let the AI stop after about ten questions.",
            "Read the summary and correct anything that isn’t quite right. You’re the authority on what you think.",
            "Decide whether the suggested next step is the right one, and put it on your calendar."
          ],
          output: "A one-paragraph summary of your thinking, a short list of open questions and one next step you chose.",
          goodLooksLike: [
            "The AI asked one question at a time and built on your answers",
            "The summary sounds like you and you’d be comfortable sharing it",
            "At least one open question is something you hadn’t named before",
            "The next step is small, specific and doable this week"
          ],
          doneWhen: "You have a summary you agree with and one next step you’ve committed to.",
          extension: "Use the summary to brief someone else: “Turn this into a 3-sentence update for my manager, ending with the one thing I need from them.”",
          watchFor: [
            "The summary may smooth over doubts you still have. Add them back if they matter.",
            "If the AI starts giving advice instead of asking, remind it to go back to questions.",
            "Keep confidential project names, financials and personal details out unless your tool is approved for them.",
            "Any interpretation the AI adds is a guess about you, not a fact. Keep only what rings true."
          ]
      },
      {
          id: "i3",
          slug: "idea-scorecard",
          level: "levelup",
          square: "Make a tough choice with a simple scorecard.",
          title: "Make a tough choice with a simple scorecard",
          category: "Critical thinking",
          time: "15–20 min",
          summary: "Choosing between 2–4 real options? Set your criteria and weights first, score each option, check whether the result holds up, then make the call yourself.",
          why: "When a choice is close, the option we already like tends to win, and it’s hard to explain why to anyone else. Agreeing on what matters before scoring anything makes your reasoning visible and fairer. A quick check of how much the weights matter shows whether you have a clear winner or a genuine close call. The scorecard organizes your judgment; it doesn’t replace it.",
          needs: [
            "Your company-approved AI chat tool",
            "A real choice with 2–4 options, such as which project to prioritize, which conference to attend, or which of two vendors or approaches to use (sanitized if needed)",
            "A rough sense of what matters most to you or your team right now"
          ],
          prompt: `You are a practical decision coach. I need to choose between a few real options, and I want to do it with a simple, fair scorecard. I make the final call; your job is to keep the process honest.

The choice: [E.G., “WHICH OF TWO PROJECTS TO PRIORITIZE NEXT QUARTER” OR “WHICH CONFERENCE TO ATTEND”]
My options (2–4, sanitized if needed):
A. [OPTION A]
B. [OPTION B]
C. [OPTIONAL]
D. [OPTIONAL]

Let’s go step by step:
Step 1: Ask me what matters most for this choice and any hard limits (budget, time, must-haves). Wait for my answer.
Step 2: Propose 4–6 criteria, each with a one-line definition and a suggested weight, totaling 100%. Don’t score any option yet. Ask me to change or confirm the criteria and weights, and wait. I decide the weights.
Step 3: Once I confirm, score each option 1–5 on each criterion. Show a table: Option | one column per criterion | Weighted total. Give a one-line reason for each score. If a score depends on information you don’t have, write “needs my input” and ask me instead of guessing.
Step 4: Check sensitivity. Show whether the winner changes if each of my top two weights moves up or down by 10 points. Tell me plainly whether the result is clear or a close call.
Step 5: Ask me whether the result matches my gut. If it doesn’t, help me find which criterion or score explains the gap.

Rules: Don’t invent facts, prices, dates or numbers about my options. The scorecard supports my decision; it doesn’t make it.`,
          steps: [
            "Pick a real choice you’re facing and list 2–4 options, leaving out confidential details.",
            "Tell the AI what matters, then set the criteria and weights yourself before anything is scored. This is the main judgment call.",
            "Review the scores and fill in every “needs my input” with what you know.",
            "Read the sensitivity check: is it a clear winner or a close call?",
            "Make the decision yourself, and note the one or two reasons you’d give if someone asked why."
          ],
          output: "A weighted scorecard for your options, a note on whether the result holds up, and a decision you can explain.",
          goodLooksLike: [
            "Criteria and weights were set before any option was scored",
            "Every score has a short, readable reason",
            "You know whether the winner is clear or a close call",
            "The final decision is yours, and you can explain it in a sentence or two"
          ],
          doneWhen: "You’ve made your choice and can explain why in one or two sentences.",
          extension: "If it’s a close call, ask: “What single piece of information would most likely change the result between my top two options, and how could I get it this week?”",
          watchFor: [
            "Scores can look more precise than the thinking behind them; treat them as structured opinions",
            "AI may fill gaps with plausible guesses about vendors, prices or events, so check every fact it adds",
            "Keep confidential project names, financials and unpublished plans out unless your tool and policy allow it",
            "If the scorecard and your gut disagree, that’s useful information, not a reason to ignore either one"
          ]
      },
      {
        id: "i4",
        slug: "skeptic-rehearsal",
        level: "levelup",
        square: "Rehearse your pitch with your toughest skeptic.",
        title: "Rehearse your pitch with a friendly skeptic",
        category: "Communication",
        time: "15–25 min",
        summary: "Have AI play a skeptical stakeholder who stays in character while you pitch, then step out and coach you on what landed.",
        why: "Most pitches fail on the questions, not the slides. Practicing against a realistic skeptic lets you find weak spots when the stakes are zero. Getting coaching afterward turns a nervous rehearsal into specific, fixable improvements.",
        needs: [
          "Your company-approved AI chat tool",
          "A pitch or proposal you can summarize in a few sentences (sanitized if needed)",
          "A rough picture of the skeptic you expect, like a finance partner or a senior leader"
        ],
        prompt: `Let’s do a pitch rehearsal. You will play a skeptical stakeholder, and later you’ll become my coach.

The skeptic: [ROLE, E.G. “A SENIOR FINANCE PARTNER”]
What they care about most: [E.G. “PAYBACK, RISK, TEAM BANDWIDTH”]
Their likely mood: [E.G. “BUSY AND UNCONVINCED BY NEW INITIATIVES”]
My pitch in brief: [2–4 SENTENCES, HYPOTHETICAL OR SANITIZED]
What I’m asking for: [E.G. “TWO WEEKS AND A SMALL BUDGET TO RUN A TEST”]

Rules for the role-play:
1. Stay fully in character as the skeptic. Ask one tough but fair question at a time and wait for my answer.
2. React realistically. If my answer is vague, press harder. If it’s strong, acknowledge it briefly and move on.
3. Ask at least 6 questions covering value, evidence, risk, cost, timing and why now.
4. Do not break character or give advice until I type the word DEBRIEF.

When I type DEBRIEF, become my coach and give me:
- A table: Question | How I answered | Strength (1–5) | A stronger answer
- The 2 moments where I gained the most credibility and the 2 where I lost it
- 3 questions I should prepare for that you didn’t ask

Don’t invent facts about my company, numbers or people. If a stronger answer needs data I haven’t given you, write “[insert real evidence]” rather than making something up.`,
        steps: [
          "Fill in the skeptic’s role, priorities and mood, plus your sanitized pitch and ask.",
          "Answer each question as you would in the real meeting. Resist the urge to type perfect, edited answers.",
          "Type DEBRIEF when you’ve had enough questions, then read the coaching table.",
          "Decide which suggested answers sound like you and which need your own evidence or judgment before you use them."
        ],
        output: "A rehearsal transcript plus a coaching table with stronger answers and a list of questions to prepare for.",
        goodLooksLike: [
          "The skeptic asked at least one question you found hard to answer",
          "The AI stayed in character until you typed DEBRIEF",
          "Stronger answers point to real evidence you can gather, not invented numbers",
          "You leave with 2–3 specific changes to your pitch"
        ],
        doneWhen: "You’ve completed the role-play, reviewed the debrief and noted the changes you’ll make.",
        extension: "Run it again with a different skeptic: “Now play a skeptical R&D leader focused on technical risk. Same rules, same DEBRIEF keyword.”",
        watchFor: [
          "A simulated skeptic isn’t your real stakeholder; use it to prepare, not to predict their reaction",
          "AI-written “stronger answers” may include claims you can’t support; only use evidence you actually have",
          "Keep confidential financials and unpublished plans out unless your approved tool and policy allow it",
          "Don’t name or describe real colleagues in ways you wouldn’t want shared"
        ]
      },
      {
        id: "i5",
        slug: "feedback-to-experiments",
        level: "levelup",
        square: "Turn messy feedback into experiments.",
        title: "From messy feedback to testable experiments",
        category: "Innovation practice",
        time: "15–25 min",
        summary: "Cluster scattered feedback into themes, then turn each theme into a testable hypothesis with a cheap way to check it.",
        why: "Feedback piles up faster than anyone can act on it, and the loudest comment often wins. Clustering first and then framing hypotheses moves you from reacting to learning. Each theme becomes something you can test, rather than something to argue about.",
        needs: [
          "Your company-approved AI chat tool",
          "10–30 pieces of feedback, paraphrased and stripped of names or personal details (a sample or made-up set works fine for practice)",
          "A sentence describing what the feedback is about"
        ],
        prompt: `You are a research-minded innovation coach. Help me turn messy feedback into a short list of experiments.

What the feedback is about: [E.G. “A PROTOTYPE BREAKFAST CONCEPT SHOWN AT AN INTERNAL TASTING”]
Where it came from: [E.G. “TEAM TASTING NOTES, STAKEHOLDER COMMENTS”]
Feedback (paraphrased, no names or personal details):
[PASTE 10–30 SHORT FEEDBACK ITEMS, ONE PER LINE]

Please work in this order:
1. Cluster the feedback into 4–7 themes. For each theme show: Theme name | Item numbers included | How many items | A one-line summary. Note any items that don’t fit and any that contradict each other.
2. Ask me which themes matter most for my goals and whether any clustering looks wrong. Wait for my answer.
3. For my top 3 themes, write a testable hypothesis in this form: “We believe [change] will result in [outcome] for [who]. We’ll know we’re right if [observable signal].”
4. For each hypothesis, propose the cheapest credible test we could run in under two weeks, what it would cost in time or effort, and what result would make us drop or keep the idea.

Rules: Don’t invent feedback, numbers or sources. Remember that a count of comments is not the same as how many consumers feel this way, so say so. Mark where a sensory, consumer insights, food safety or regulatory expert should be involved in designing the test.`,
        steps: [
          "Gather and paraphrase the feedback, removing names and any personal or confidential details.",
          "Review the clusters and correct anything the AI grouped wrongly. You know the context behind the comments.",
          "Pick the three themes that matter most and check that each hypothesis is genuinely testable.",
          "Choose one experiment to run and decide who needs to be involved."
        ],
        output: "A short set of feedback themes, three testable hypotheses and a cheap experiment for each.",
        goodLooksLike: [
          "Themes reflect what was actually said, including contradictions",
          "Each hypothesis has a clear, observable signal of success",
          "Tests are small enough to run within two weeks",
          "Expert involvement is flagged where it matters"
        ],
        doneWhen: "You’ve chosen one hypothesis and its test to run next.",
        extension: "Ask the AI to stress-test your top experiment: “What could make this test give us a misleading result, and how do we design around it?”",
        watchFor: [
          "Never paste consumer personal data or identifiable comments; paraphrase and anonymize first",
          "Internal or small-sample feedback isn’t representative of consumers, so treat themes as leads",
          "AI may smooth over contradictions; check that dissenting comments weren’t lost",
          "Real consumer tests should go through approved research channels and processes"
        ]
      },
      {
          id: "i6",
          slug: "feedback-growth-plan",
          level: "levelup",
          square: "Turn feedback you got into a growth plan.",
          title: "Turn feedback you got into a growth plan",
          category: "Everyday work",
          time: "15–25 min",
          summary: "Paste feedback you’ve received, with names removed, and have AI help you find the real patterns, pick one behavior to work on, and plan small weekly actions.",
          why: "Feedback often arrives in a pile: a review, a few comments, a 360 report. It’s hard to read calmly, and it’s easy to fixate on the one sharp comment and miss the pattern. AI can sort it without the sting, separate repeated themes from one-offs, and turn “be more strategic” into something you can actually practice next week. You decide what’s fair and what to work on.",
          needs: [
            "Your company-approved AI tool",
            "Feedback you’ve received: a review, a 360 summary, comments after a presentation, or notes from a 1:1",
            "Remove names, other people’s details and anything confidential before you paste. Paraphrase if you prefer."
          ],
          prompt: `Act as a thoughtful career coach. I’m going to share feedback I’ve received. Help me turn it into a focused growth plan. Work in stages and wait for me between them.

THE FEEDBACK (names and confidential details removed):
[PASTE OR PARAPHRASE THE FEEDBACK]
Where it came from: [E.G., ANNUAL REVIEW, 360, PEERS AFTER A PRESENTATION]
My role and what I’m aiming for: [E.G., SENIOR SCIENTIST, WANT TO LEAD LARGER PROJECTS]

Stage 1: Patterns. Group the feedback into themes. For each theme, show the comments it came from and label it REPEATED (several sources say it) or ONE-OFF. List strengths separately; don’t skip them. Use only what’s in the feedback, and don’t guess at the motives of the people who wrote it. Then ask me which themes feel fair and which surprised me, and stop.

Stage 2: Focus. Based on my answer, help me pick ONE behavior to work on: the one with the biggest payoff for my goal. Rewrite it as something observable, e.g., “I share a clear recommendation before the discussion starts” rather than “be more strategic.” Then stop.

Stage 3: Plan. Give me:
1. Three small actions I can practice in the next four weeks, tied to meetings or work I already have.
2. One way to tell it’s working, without a survey.
3. A short, natural question I can ask one or two colleagues in a month to get fresh feedback.

Keep the tone encouraging but honest. Don’t soften the feedback until it means nothing.`,
          steps: [
            "Gather feedback you’ve received. Remove names and any confidential project details, or paraphrase in your own words.",
            "Paste the prompt into your approved AI tool, fill in the brackets and send.",
            "Read the Stage 1 themes and decide for yourself which feel fair. You know the context; the AI doesn’t.",
            "Pick your one behavior in Stage 2. Choose the one that matters most for your goal, not the easiest one.",
            "Put the three actions in your calendar next to the meetings they belong to, and set a reminder to ask for fresh feedback in a month."
          ],
          output: "A one-page plan: your feedback themes, the one behavior you’re working on, three weekly actions, and a follow-up question for colleagues.",
          goodLooksLike: [
            "The themes reflect what people actually said, with repeated patterns clearly separated from one-offs",
            "Your focus is one specific, observable behavior, not a vague trait",
            "Each action fits into work you already do, so it doesn’t need extra time",
            "You have a simple way to find out in a month whether anything changed"
          ],
          doneWhen: "You’ve chosen one behavior to work on and scheduled your first action.",
          extension: "Ask for a role-play: “Play a colleague in a meeting where I practice this behavior. Give me a realistic situation, let me respond, then tell me what worked and what to try next time.”",
          watchFor: [
            "Remove names and details about other people. Feedback is about you, but it often mentions colleagues.",
            "AI can over-read or soften feedback. Check its themes against the original words.",
            "Formal performance matters, such as ratings, development plans or concerns, belong with your manager and HR. Use this for your own reflection.",
            "Keep the plan small. One behavior practiced well beats five half-tried."
          ]
      },
      {
          id: "i7",
          slug: "learning-plan",
          level: "levelup",
          square: "Build a 30-day plan to learn a new skill.",
          title: "Build a 30-day plan to learn a new skill",
          category: "Everyday work",
          time: "15–20 min",
          summary: "Pick a skill you want to grow, let AI build a realistic week-by-week plan around your time and level, then get quizzed on day one.",
          why: "Learning goals often stall because they’re too big or too vague to start. A plan built around your real calendar, with small practice tasks tied to your actual work, makes progress feel doable. A quick quiz on day one turns the plan into practice straight away, and shows you where to focus.",
          needs: [
            "Your company-approved AI chat tool",
            "A skill you’d like to build, such as a statistics method, a sensory-science concept, presenting data, a new software tool or better AI prompting",
            "An honest sense of how much time you have each week",
            "Access to your company’s learning resources for finding courses and materials"
          ],
          prompt: `You are a patient, practical learning coach. Help me build a realistic 30-day plan to learn a new skill, then check my understanding on day one.

The skill: [E.G., “DESIGN OF EXPERIMENTS BASICS,” “A SENSORY-SCIENCE CONCEPT LIKE TRIANGLE TESTS,” “PRESENTING DATA CLEARLY,” “A NEW SOFTWARE TOOL,” “WRITING BETTER AI PROMPTS”]
Why I want it: [HOW YOU’D USE IT AT WORK]

Work with me step by step:
1. Ask me, one question at a time, about my current level, how much time I have each week, how I like to learn (reading, video, doing, talking it through), and what “good enough” looks like on day 30. Wait for each answer.
2. Build a 4-week plan. For each week give: a focus, 2–3 small practice tasks I can do in my real work (each under 30 minutes), and a quick self-check to know I’m on track. Keep the total within the time I told you.
3. For resources, describe the type to look for (for example, “an introductory course on this topic” or “your team’s internal guide”) rather than naming specific titles or links. If you do name a specific book, course or link, mark it “unverified” so I check it exists. Remind me to look at company learning resources first.
4. Ask me whether the plan feels realistic and adjust it based on my answer. I decide what stays in.
5. Then start day one: quiz me with 5 short questions on the basics, one at a time. After each answer, tell me what I got right and explain anything I missed in plain language.

Rules: Don’t invent facts, statistics or resources. If you’re unsure about something technical, say so.`,
          steps: [
            "Choose one skill that would make a real difference in your work over the next month.",
            "Answer the AI’s questions honestly, especially about your time. A plan you can keep beats an ambitious one you can’t.",
            "Review the plan and cut or swap anything that doesn’t fit your work or your week. You know what’s realistic.",
            "Take the day-one quiz and notice what you already know and where you need more practice.",
            "Look up any suggested resources in your company’s learning tools before using anything else, and put week one’s tasks on your calendar."
          ],
          output: "A week-by-week learning plan with small practice tasks, plus a day-one quiz that shows where to start.",
          goodLooksLike: [
            "The plan fits inside the time you said you have",
            "Practice tasks connect to your real work, not just reading",
            "Any named resource is marked unverified until you’ve checked it",
            "The quiz explanations helped you understand something better"
          ],
          doneWhen: "You’ve finished the day-one quiz and put the first week’s tasks on your calendar.",
          extension: "Come back at the end of week one and ask: “Here’s what I did this week and what felt hard. Adjust next week’s plan and quiz me on what I learned.”",
          watchFor: [
            "AI may recommend books, courses or links that don’t exist. Verify every title and link, and prefer company learning resources.",
            "Technical explanations can be slightly off. Check important concepts with a colleague or trusted source.",
            "Quizzes from AI can contain wrong answers. If an answer seems off, question it.",
            "Keep confidential project details out of your practice tasks unless your tool is approved for them."
          ]
      },
      {
          id: "i8",
          slug: "process-one-pager",
          level: "levelup",
          square: "Turn a messy process into a one-page how-to.",
          title: "Turn a messy process into a one-page how-to",
          category: "Workflow redesign",
          time: "15–25 min",
          summary: "Describe a process you know well, let AI ask clarifying questions and draft a one-page how-to, then test it with AI playing a brand-new employee.",
          why: "Every team has processes that live in one person’s head, and they’re hard to write down because the expert no longer sees the steps. Being questioned pulls out the details you skip without noticing. Testing the page with a “new employee” shows exactly where a real newcomer would get stuck, before one does.",
          needs: [
            "Your company-approved AI chat tool",
            "A process you know well, such as onboarding a new team member, submitting a sample request or setting up a sensory test",
            "Non-confidential notes about it, or a sanitized description in your own words"
          ],
          prompt: `You are a clear, practical technical writer. Help me turn a process I know well into a one-page how-to that a new colleague could follow. I’m the expert on this process; you help me organize and write it.

The process: [E.G., “ONBOARDING A NEW TEAM MEMBER,” “SUBMITTING A SAMPLE REQUEST,” “SETTING UP A SENSORY TEST”]
Who will use the guide: [E.G., “A NEW HIRE IN THEIR FIRST MONTH”]
My notes (non-confidential or sanitized): [DESCRIBE THE STEPS AS YOU’D EXPLAIN THEM, OR PASTE ROUGH NOTES]

Work with me in stages:
1. Ask me up to 5 clarifying questions about gaps, such as who does what, where things get stuck and what people usually get wrong. Ask one at a time and wait for each answer.
2. Write a one-page how-to with these sections: Purpose (one sentence) | Before you start | Steps (numbered, each starting with a verb, with the owner in brackets) | Common mistakes | FAQ (4–5 questions) | Who to ask for help. Keep it under 400 words.
3. Wherever my notes didn’t say something (an owner, a system name, a timing), write [CHECK] instead of filling it in.
4. Ask me to review the draft and tell you what to change. Wait for my reply.
5. Then test it: play a brand-new employee who has only this page. Ask me 5 naive but realistic questions, one at a time. After the last one, list which parts of the page should change so those questions are answered up front.

Rules: Don’t invent steps, names, systems, tools or policies. If something sounds like it should follow an official procedure, flag it so I can confirm with the process owner.`,
          steps: [
            "Pick a process you know well and others often ask you about. Write or paste rough, non-confidential notes.",
            "Answer the AI’s clarifying questions. This is where your expertise fills the gaps.",
            "Review the draft and replace every [CHECK] with the right detail, or confirm it with the process owner.",
            "Answer the “new employee” questions and decide which ones the page should answer up front.",
            "Share the final page with a colleague who knows the process and ask them to catch anything missing."
          ],
          output: "A one-page how-to with steps, owners, common mistakes and an FAQ, tested against a newcomer’s questions.",
          goodLooksLike: [
            "Every step starts with a verb and has a named owner or role",
            "Gaps are marked [CHECK] rather than filled in with guesses",
            "The FAQ answers the questions a newcomer actually asked",
            "Someone new could follow it without needing to find you first"
          ],
          doneWhen: "You have a reviewed one-page how-to with no [CHECK] markers left, ready to share with your team.",
          extension: "Turn it into a quick checklist: “Make a 10-item checklist version of this page that someone could tick off as they go.”",
          watchFor: [
            "AI may invent plausible steps, system names or policies. Check every step against how the process really works.",
            "Official procedures, safety steps or quality requirements must match the approved source, not the AI’s version.",
            "Keep confidential system details, supplier names and personal information out unless your tool is approved for them."
          ]
      },

    /* ===== GO FURTHER (advanced) ===== */
    {
        id: "a1",
        slug: "three-expert-panel",
        level: "gofurther",
        square: "Convene a 3-expert AI panel to debate an idea.",
        title: "Convene a three-expert AI panel",
        category: "Critical thinking",
        time: "40–60 min",
        summary: "Run three independent AI critiques of one idea (desirability, feasibility, viability) and have a fourth “chair” session synthesize where they disagree.",
        why: "When one chat plays every expert, the “experts” read each other’s answers and quietly converge, so you get consensus that was never earned. Separating the critiques into sessions that cannot see each other produces real disagreement, and the disagreements are where the useful decisions hide. You also learn how much a model’s answer depends on what else is in its context window.",
        needs: [
          "A hypothetical or sanitized product or process idea, written in 3–5 sentences",
          "Your company-approved AI tool, ideally able to open several fresh chats or agents",
          "A blank document for the decision memo"
        ],
        prompt: `SIMULATED-ROLE VERSION (single chat). The three perspectives below are role-played by one model in one conversation, so they are NOT independent. Treat agreement between them with suspicion.

You are facilitating a structured critique of one idea. Work in stages and stop where I tell you to.

THE IDEA:
[DESCRIBE THE CONCEPT IN 3–5 SENTENCES. USE A HYPOTHETICAL OR NON-CONFIDENTIAL VERSION.]
Target consumer: [WHO IT IS FOR]
Decision I need to make: [E.G., MOVE TO PROTOTYPE, REVISE, OR STOP]

Stage 1: Consumer desirability critic. Write only from the view of someone who studies how real people shop, cook and eat. Give: the strongest reason a consumer would want this, the three biggest reasons they would not, and the riskiest assumption about consumer behavior.

Stage 2: Technical feasibility critic. Before writing, set aside the Stage 1 analysis and do not refer to it. Give: what must work technically (formulation, process, shelf life, packaging, scale-up), the three hardest problems, and which ones only a qualified scientist or engineer could judge.

Stage 3: Commercial viability critic. Again, do not refer to Stages 1 or 2. Give: how this could make money, the three biggest commercial risks (cost, channel, cannibalization, competitive response), and the riskiest financial assumption.

For every point in Stages 1–3, label it EVIDENCE (something I told you or widely established), ASSUMPTION, or NEEDS EXPERT. Do not invent statistics, market sizes or sources.

Stop after Stage 3 and ask me whether any critique missed something I know.

Stage 4: Chair synthesis. After my reply, produce:
1. A table with columns: Topic | Desirability view | Feasibility view | Viability view | Agree or disagree?
2. The 3 most critical assumptions, ranked by how badly the idea fails if they are wrong.
3. One small, cheap experiment per assumption, with what result would change the decision.
4. A one-line recommendation, with the decision explicitly left to me.`,
        steps: [
          "Write the idea in 3–5 sentences using hypothetical or sanitized details, plus the decision you need to make. Keep this text identical across every session.",
          "For a truly independent panel, open three separate fresh chats (or three separate agents). In each, paste the idea plus only one critic’s instructions from Stages 1, 2 or 3. No session should see another’s answer.",
          "Open a fourth fresh chat as the chair. Paste the idea and all three critiques, labeled Critic 1, 2 and 3, then paste the Stage 4 instructions.",
          "Human judgment: read the chair’s synthesis against the raw critiques. Check that it did not smooth over a real disagreement, and mark which feasibility or commercial claims need a real expert.",
          "Write a one-page decision memo: the idea, the main disagreements, the 3 critical assumptions, the experiments, and your own recommendation."
        ],
        output: "A one-page decision memo built from three independent critiques and a chair synthesis.",
        goodLooksLike: [
          "The three critiques disagree on at least one substantive point; if they all agree, the setup leaked context or the idea description was too vague",
          "Each critical assumption is specific enough to be proven wrong by a single experiment",
          "Every claim is tagged evidence, assumption or needs-expert, and none of the numbers were invented",
          "A colleague can read the memo in two minutes and name the decision and its biggest risk",
          "Comparing the independent run with the single-chat version shows you a concrete difference in what surfaced"
        ],
        doneWhen: "You have a one-page memo naming the main disagreements, three testable assumptions and your decision, with any expert-dependent claims flagged.",
        extension: "Run the single-chat simulated version on the same idea and compare it with the independent panel. Ask the chair: “Which points appear in the independent critiques but not in the simulated one, and why might that be?”",
        watchFor: [
          "Role-play in a single chat is simulated, not independent; the model sees its own earlier answers and drifts toward agreement",
          "AI critics are not real consumers, scientists or finance partners; treat their views as hypotheses to check with people",
          "Technical feasibility statements about formulation, safety or processing need validation by qualified experts",
          "Use only hypothetical or sanitized ideas in approved tools; do not paste unpublished plans or formulas"
        ],
        fallback: "If you only have one basic chat, use the prompt above as written. It is a simulated-role alternative, so label your memo “single-session simulation” and do not describe the perspectives as independent."
      },
      {
          id: "a2",
          slug: "doc-to-visual",
          level: "gofurther",
          square: "Turn a dense document into a one-page visual.",
          title: "Turn a dense document into a one-page visual",
          category: "Communication",
          time: "30–45 min",
          summary: "Have AI find the structure hidden in a dense process, report or plan, turn it into a one-page diagram, then check it line by line against the source.",
          why: "Most people use AI to produce more words. This square uses it to replace words with structure. The hard part of a good visual is deciding what shape the information really has: a sequence, a comparison, a timeline or a hierarchy. AI is fast at proposing those shapes and drafting the diagram, and you stay responsible for the part it’s weakest at, which is making sure every box is true to the source.",
          needs: [
            "Your company-approved AI tool. Diagram, chart or slide features help but aren’t required.",
            "A dense, non-confidential document: a process description, a public report, a project plan or a long email thread",
            "PowerPoint or another approved tool to finish the visual"
          ],
          prompt: `Help me turn a dense document into a one-page visual. Work in stages and wait for me between them.

DOCUMENT (non-confidential, or my tool is approved for it):
[PASTE THE TEXT, OR DESCRIBE THE PROCESS OR REPORT]
Audience: [WHO WILL SEE IT]
What they should understand in 10 seconds: [THE ONE MESSAGE]

Stage 1: Find the shape. Tell me which structure fits best (process flow, comparison table, timeline, hierarchy, cycle, or before-and-after) and why, plus one alternative. List the 5–9 elements that must appear, each with a short quote or reference to where it comes from in the document. Then stop.

Stage 2: Draft the visual. After I choose, produce it in the best format you can:
- If you can draw diagrams or charts, make one.
- Otherwise give me diagram code my tool can render (such as Mermaid), or a slide layout spec: boxes, labels of 6 words or fewer, arrows and grouping, so I can build it in PowerPoint.

Stage 3: Accuracy check. Make a table with columns: Element in the visual | Where it comes from in the document | Simplified or changed? | Risk of misleading. Flag anything you added that isn’t in the source.

Stage 4: The 10-second test. Write 3 questions I can ask a colleague after showing them the visual for 10 seconds, to check whether the one message landed.

Never invent steps, numbers or labels that aren’t in the document. Where the document is ambiguous, ask me instead of guessing.`,
          steps: [
            "Choose a dense document you or your team actually struggle to explain. Keep it non-confidential.",
            "Run Stage 1 and decide the shape yourself. Choosing the structure is the real design decision.",
            "Get the draft in Stage 2 and build or tidy it in PowerPoint or your approved tool. Avoid AI image generators for factual diagrams; they often garble text and invent details.",
            "Use the Stage 3 table to check every element against the source. Fix anything simplified too far or added.",
            "Show the visual to a colleague for 10 seconds, ask the Stage 4 questions, and revise based on what they missed."
          ],
          output: "A one-page visual, plus an accuracy table showing where every element comes from and the results of your 10-second test.",
          goodLooksLike: [
            "A colleague gets the one message within 10 seconds",
            "Every element traces back to the source document; nothing is invented",
            "Labels are short, and the structure (flow, comparison, timeline) matches how the information actually works",
            "It replaces at least a page of text, or a few minutes of explaining",
            "You can name what was simplified and why that’s acceptable for this audience"
          ],
          doneWhen: "You have a finished one-page visual that passed your accuracy check and a 10-second colleague test.",
          extension: "Ask for the same content in a second structure, for example a timeline instead of a flow, and test both with two colleagues. Which shape communicates better, and why?",
          watchFor: [
            "Simplifying is where errors creep in. A missing step or merged box can change the meaning.",
            "AI image generators are poor at accurate labels and diagrams. Use diagram tools, charts or PowerPoint for anything factual.",
            "A clean visual can make uncertain information look settled. Mark estimates and open questions clearly.",
            "Don’t paste confidential documents unless your tool is approved for them."
          ],
          fallback: "In a basic chat tool, use the slide layout spec option in Stage 2 and build the visual yourself in PowerPoint (SmartArt works well for flows and hierarchies). Stages 1, 3 and 4 work exactly as written."
      },
      {
        id: "a3",
        slug: "workflow-redesign",
        level: "gofurther",
        square: "Redesign a workflow as if AI were on the team.",
        title: "Redesign a workflow with AI on the team",
        category: "Workflow redesign",
        time: "45–60 min",
        summary: "Map a current process step by step, question which steps need to exist at all, and redesign it around human judgment plus AI, ending with a two-week pilot.",
        why: "Adding AI to each existing step usually makes a slow process slightly less slow. The bigger gains come from asking why a step exists, what decision it really serves, and which judgments must stay human. This exercise makes AI your process-design partner rather than a task helper.",
        needs: [
          "A recurring process you know well, described hypothetically or using approved, non-confidential information",
          "Your company-approved AI tool",
          "Rough time estimates for each step, even if approximate"
        ],
        prompt: `You are an operations designer who specializes in redesigning knowledge work for teams that include AI tools. Work in stages and pause where I say.

THE PROCESS:
Name: [E.G., “PREPARING A CONCEPT REVIEW PACKAGE FOR A STAGE-GATE MEETING”]
Goal of the process: [WHAT DECISION OR OUTPUT IT EXISTS TO PRODUCE]
Current steps, in order, with who does each and roughly how long it takes:
[LIST 6–12 STEPS. USE HYPOTHETICAL OR NON-CONFIDENTIAL DETAILS.]

Stage 1: Map. Produce a table: Step | Owner | Time | Input | Output | Type (judgment, creation, gathering, formatting, approval, waiting, rework). Flag bottlenecks, repeated work and handoffs where information is lost. Mark any time figure you inferred rather than took from me. Stop and ask me to correct the map.

Stage 2: Challenge. For every step, answer: What decision does this serve? What would happen if we stopped doing it? Could it be merged, moved earlier, or done once instead of every time? Be blunt, but label each challenge as a hypothesis.

Stage 3: Redesign. Design the new workflow from the goal backwards, not by adding AI to the old steps. Produce a before/after table: Old step | New step (or REMOVED) | Human role | AI role | Why this split. Human roles must cover judgment, accountability, consumer and safety decisions, and approvals. Name the AI capability each AI role relies on (drafting, summarizing, comparing, checking against a list) and how its output gets checked.

Stage 4: Risks. List what could go wrong: errors that AI could introduce, approvals that must not be skipped, quality or regulatory checkpoints, and people affected by the change. Flag anything requiring sign-off from legal, quality, regulatory or IT.

Stage 5: Pilot. Design a 2-week pilot: scope, who participates, 3 measures (time, quality, satisfaction) with a baseline, how to compare against the old way, and a stop rule.

Do not invent productivity statistics or benchmarks.`,
        steps: [
          "Choose a process you run at least monthly. Write the steps, owners and rough times using hypothetical or approved, non-confidential details.",
          "Run Stages 1 and 2. Human judgment: correct the map, then decide which of AI’s “stop doing this” challenges are genuinely possible and which miss a reason only insiders know.",
          "Run Stage 3 and push back if the redesign looks like the old process with AI bolted on. Ask: “Which old steps disappeared entirely, and why?”",
          "Run Stages 4 and 5. Check the risks with whoever owns quality, compliance or approvals before treating the pilot as real.",
          "Assemble a one-page before/after workflow table plus the pilot plan."
        ],
        output: "A before/after workflow table and a two-week pilot plan with measures and a stop rule.",
        goodLooksLike: [
          "At least one step is removed or merged, not just sped up",
          "Every AI role names how its output is checked and by whom",
          "Required approvals and quality checkpoints are still present in the new design",
          "The pilot has a baseline, three measures and a stop rule that someone could actually apply",
          "A teammate who runs this process today recognizes the map as accurate"
        ],
        doneWhen: "You have a before/after table and a pilot plan that a process owner could approve or reject in one meeting.",
        extension: "Ask: “Redesign this process a second time assuming we have to cut total elapsed time by half without removing any approvals. What has to change that we have not yet questioned?”",
        watchFor: [
          "AI does not know your real constraints, politics or regulatory requirements; its “just remove this step” ideas need insider review",
          "Time savings it proposes are estimates, not measurements, until the pilot produces data",
          "Changes affecting quality, food safety, regulatory or approvals need sign-off from the right owners",
          "Describe the process without confidential documents, project names or personal data"
        ],
        fallback: "This works fully in a basic chat. If long staged prompts get lost, paste one stage at a time and copy the previous stage’s table back in before continuing."
      },
      {
          id: "a4",
          slug: "ten-minute-training",
          level: "gofurther",
          square: "Build a 10-minute training for your team.",
          title: "Build a 10-minute training for your team",
          category: "Workflow redesign",
          time: "35–50 min",
          summary: "Use AI as an instructional designer to turn something you know well into a short training with real-world practice questions, pilot it on a colleague, and fix what confused them.",
          why: "Every team has know-how that lives in a few people’s heads, and most of it never gets taught because building a training takes too long. AI can draft the parts that usually take hours: learning objectives, realistic scenarios and plausible wrong answers that reveal misunderstandings. You supply the expertise and judge what’s right, and a quick pilot shows you whether people actually learned it.",
          needs: [
            "Your company-approved AI tool",
            "A topic you know well that others on your team need, e.g., how to submit a sample request, how to read a sensory report, or how your project stage-gates work",
            "One colleague willing to spend 10 minutes trying it"
          ],
          prompt: `You are an instructional designer. I’m the subject-matter expert. Help me build a 10-minute training for my team. Work in stages and wait for me between them.

TOPIC: [WHAT YOU WANT TO TEACH. USE NON-CONFIDENTIAL MATERIAL]
Learners: [WHO, AND WHAT THEY ALREADY KNOW]
What goes wrong today: [THE MISTAKES OR QUESTIONS YOU SEE MOST]
My expert notes: [THE KEY STEPS, RULES OR TIPS, IN YOUR OWN WORDS]

Stage 1: Objectives. Propose 3 learning objectives, each starting with an action verb (e.g., “Choose…”, “Spot…”), tied to the mistakes I listed. Ask me 2 questions about anything in my notes that’s unclear. Then stop.

Stage 2: Practice. Write 5 scenario-based questions set in realistic situations. Each needs one correct answer, two plausible wrong answers that reflect real misunderstandings, and one line of feedback for every option. Use only what’s in my notes. If something needs a fact I didn’t give you, mark it [EXPERT TO CONFIRM] instead of guessing. Then stop for my review.

Stage 3: Job aid. Turn the essentials into a one-page cheat sheet: steps, common mistakes and who to ask.

Stage 4: Pilot plan. Give me a 10-minute run-of-show for testing it on one colleague, and 3 debrief questions to find what confused them.`,
          steps: [
            "Pick a topic where you are the expert and the material isn’t confidential. Don’t use this to replace required or official compliance training.",
            "Work through Stages 1–3, correcting the AI wherever it misreads your notes. You are the authority on what’s right.",
            "Check every [EXPERT TO CONFIRM] item and every answer key before anyone sees it.",
            "Run the pilot with one colleague. Watch which questions they get wrong and where they hesitate.",
            "Revise the confusing parts, then share the module and cheat sheet with your team or keep it for the next new starter."
          ],
          output: "A 10-minute training with 3 objectives, 5 scenario questions with an answer key, a one-page cheat sheet, and notes from one pilot.",
          goodLooksLike: [
            "Each question tests a real decision people make, not trivia",
            "The wrong answers are tempting because they reflect real mistakes",
            "You checked every answer and fact, and nothing is marked unconfirmed",
            "Your pilot colleague could do something afterward they couldn’t do before",
            "Someone new could use the cheat sheet without asking you"
          ],
          doneWhen: "You’ve piloted the training with one colleague and revised it based on what you saw.",
          extension: "Ask for a harder version for experienced team members: “Write 3 tricky edge-case scenarios where the usual rule doesn’t apply, and explain the judgment call in each.”",
          watchFor: [
            "AI can fill gaps with confident but wrong procedure. Only your notes and your review make it accurate.",
            "Official, regulatory, safety or compliance training must go through the proper channels. Use this for team know-how.",
            "Keep confidential processes, formulas and customer details out unless your tool is approved for them.",
            "A training that looks polished can still teach the wrong thing. The pilot is what tells you it works."
          ],
          fallback: "This works in any basic approved chat tool as written. If your tool can create documents, slides or forms, ask it to format Stage 2 as a quiz and Stage 3 as a one-page document you can share."
      },
      {
          id: "a5",
          slug: "research-head-start",
          level: "gofurther",
          square: "Give your next research question a head start.",
          title: "Give your research question a head start",
          category: "Consumer understanding",
          time: "30–45 min",
          summary: "Use AI as a research assistant to scope your question, map what is known and unknown, and draft a desk-research plan and interview guide, so your expertise and your research partners can start from a stronger plan.",
          why: "The slow part of starting research is often the setup: scoping the question, sorting what you know from what you assume, deciding where to look and drafting a guide. An AI research assistant can draft that scaffolding quickly. It cannot tell you what is true about consumers, and it does not know what your experience and your insights colleagues know. This exercise practices a clear division of work: AI prepares materials, you make the research calls, and real consumers, approved research partners and checked sources supply the evidence.",
          needs: [
            "A research question you own, framed hypothetically or without confidential detail",
            "Your company-approved AI tool; web or deep-research features only if your approved tool includes them",
            "Awareness of your organization’s approved research partners and consumer research policies"
          ],
          prompt: "You are a research assistant supporting me. I am the researcher: I own the question, the method choices and the conclusions. Your job is to help me prepare faster by organizing, drafting and listing what to check. You do not supply findings. Never invent data, statistics, quotes, studies or citations. If you name a source type or organization, label it TO VERIFY.\n\nMY RESEARCH QUESTION:\n[STATE IT IN 1–2 SENTENCES. USE A HYPOTHETICAL OR NON-CONFIDENTIAL VERSION, E.G., “WHY DO PARENTS OF TEENS STOP BUYING BREAKFAST BARS?”]\nDecision it informs: [WHAT WILL CHANGE BASED ON THE ANSWER]\nWhat I already know from my own work: [YOUR EXPERTISE AND HYPOTHESES, LABELED AS SUCH]\n\nStage 1: Scope. Suggest 3–5 sub-questions and one thing I could deliberately leave out of scope. Ask me 3 questions that would help you understand what my expertise already tells me. Stop and let me rewrite.\n\nStage 2: Known vs unknown map. Table: Sub-question | Evidence I gave you | What I am assuming | Genuinely unknown | Best way to find out (published source, internal expert, insights team, approved research partner, real consumers). Put nothing in the evidence column that I did not give you. Stop and let me correct it.\n\nStage 3: Desk-research plan. Source types to check (not invented titles), search terms, and 3 questions for judging each source’s quality. If my tool has approved web or deep-research features, tell me how to confirm that each cited source exists and says what is claimed.\n\nStage 4: Draft interview guide. A 30-minute guide for real consumer or expert conversations: warm-up, 8 open questions with probes, no leading questions. Mark which questions I should check with my insights team or research partner.\n\nStage 5: Verification checklist. A checklist I complete before sharing anything, covering: the source exists and says what is cited, quote accuracy, sample limits, what came from AI drafting versus real consumers or verified sources, and privacy rules for consumer data. Flag every item that needs insights, legal or privacy review.",
          steps: [
            "Write your question, the decision it informs and what you already know from your own work, keeping details hypothetical or non-confidential.",
            "Run Stages 1 and 2. Human judgment: rewrite the sub-questions in your own terms and correct the known/unknown map. You know the category; the assistant is pattern-matching.",
            "Run Stage 3. If your approved tool has web or deep-research features, open every cited source yourself to confirm it exists and supports the claim.",
            "Run Stage 4 and edit the guide for leading questions. Human judgment: review it with your insights team or research partner before any fieldwork.",
            "Run Stage 5 and compile a one-page plan: question, sub-questions, known/unknown map, desk-research plan, guide outline and verification checklist."
          ],
          output: "A one-page research plan with a known/unknown map and a verification checklist.",
          goodLooksLike: [
            "The evidence column contains only what you supplied or verified; nothing in it came from AI unchecked",
            "Each unknown names who or what will answer it: a source, an expert, the insights team, a research partner or real consumers",
            "No citation, statistic or quote appears without a person having opened and checked the source",
            "An insights colleague would use the interview guide with minor edits, not a rewrite",
            "The verification checklist could be used as a real gate before sharing findings"
          ],
          doneWhen: "You have a one-page plan you would be comfortable walking an insights colleague through, with a verification checklist that works as a gate before anything is shared.",
          extension: "Ask: “Role-play three very different interviewees answering question 4, then tell me which of my probes failed to get past a surface answer.” Use the role-play only to test the guide, never as data.",
          watchFor: [
            "AI can fabricate citations, statistics and quotes that look real; verify every source by opening it",
            "Simulated consumer responses are not consumer research and must never be reported as findings",
            "Consumer personal data must follow privacy policies and stay out of unapproved tools",
            "Research design choices should be reviewed by insights professionals before fieldwork"
          ],
          fallback: "In a chat-only tool without web access, skip the search part of Stage 3 and ask for source types and search terms you will run yourself. Everything else in the prompt works as written."
      },
      {
          id: "a6",
          slug: "devils-advocate",
          level: "gofurther",
          square: "Have AI play devil’s advocate on your plan.",
          title: "Have AI play devil’s advocate on your plan",
          category: "Critical thinking",
          time: "25–40 min",
          summary: "Have AI argue hard against a plan you believe in, defend it round by round, and come out with a sharper plan or an honest change of mind.",
          why: "Most of us collect agreement for plans we like. A good devil’s advocate argues the other side as strongly as possible so you can find the weak spots before someone else does. AI is useful here because it has no stake in being polite. The skill you practice is defending a position with reasons and evidence, and noticing when you can’t.",
          needs: [
            "Your company-approved AI tool",
            "A plan, recommendation or decision you currently favor, in a hypothetical or non-confidential version",
            "Optional: a second, fresh chat, so the devil’s advocate can’t see which side you’re on"
          ],
          prompt: `Play devil’s advocate against my plan. Your job is to argue as strongly as you can that I’m wrong, then help me judge which arguments actually hold up. Work in stages and wait for me between them.

MY PLAN:
[DESCRIBE IT IN 3–5 SENTENCES. USE A HYPOTHETICAL OR NON-CONFIDENTIAL VERSION.]
Why I believe it: [YOUR TOP 3 REASONS]
My confidence that it’s right: [0–100]

Stage 1: The case against. Give the 5 strongest arguments against my plan, strongest first. Make them specific, not generic. For each, say what would have to be true for the argument to win. Label every point EVIDENCE (from what I told you or well established) or ASSUMPTION. Never invent data, statistics or sources. Then stop.

Stage 2: My rebuttals. I’ll answer each argument. Score each rebuttal HOLDS, PARTLY HOLDS or FAILS, with one line on why. Then push harder on my weakest answer, once. Then stop.

Stage 3: Switch sides. Now make the strongest case FOR my plan against your own attacks, to check you weren’t just being contrary.

Stage 4: Summary table with columns: Argument | My rebuttal | Verdict | Evidence that would settle it. Then ask me for my new confidence (0–100). Do not make the decision for me. Flag any point that needs a subject-matter expert.`,
          steps: [
            "Pick a plan you genuinely favor. The exercise works best when you care about the answer.",
            "For a tougher devil’s advocate, open a fresh chat and present the plan neutrally, as “a team is considering this plan”, so the AI can’t tell which side you’re on.",
            "Write your rebuttals yourself before reading the AI’s scores. This is where your expertise does the work.",
            "Check any argument that relies on a fact you can’t confirm. A persuasive argument isn’t automatically a true one.",
            "Compare your confidence before and after, and write a short note: what changed, what you’ll test, and what you’ll keep."
          ],
          output: "A one-page summary table of the five strongest arguments against your plan, how you answered each, and your confidence before and after.",
          goodLooksLike: [
            "The arguments are specific to your plan, not generic risks that apply to anything",
            "At least one argument made you change the plan, add a test, or explain your reasoning better",
            "Your rebuttals rest on reasons or evidence, not just restating the plan",
            "The side-switch in Stage 3 shows the AI can argue both ways, so you know it isn’t just contrarian",
            "You made the final call and can say why"
          ],
          doneWhen: "You have the summary table and a short note on what you’ll change, test or keep.",
          extension: "Swap roles: you play devil’s advocate against a plan the AI proposes, and ask it to score your arguments using the same HOLDS / PARTLY HOLDS / FAILS scale.",
          watchFor: [
            "AI can argue any side convincingly. How persuasive an argument sounds tells you nothing about whether it’s true.",
            "Don’t let it talk you out of something your expertise or real data supports. Ask what evidence would settle the question instead.",
            "It may invent facts to strengthen an argument. Check anything you’d repeat to others.",
            "Use a hypothetical or sanitized plan unless your tool is approved for confidential strategy."
          ],
          fallback: "This works in a single basic chat as written. If your tool supports separate agents or sessions, run Stage 1 in a fresh session that only sees a neutral description of the plan, then paste its arguments into your main chat for Stages 2–4."
      },
      {
        id: "a7",
        slug: "blind-taste-test-for-ai",
        level: "gofurther",
        square: "Make two AI approaches compete. Judge them blind.",
        title: "Blind taste test for AI",
        category: "AI experimentation",
        time: "45–60 min",
        summary: "Pick two AI approaches, write a scoring rubric before running them, judge the anonymized outputs blind, and decide when to use which.",
        why: "Daily users form strong opinions about which model or prompt style is better, but almost never test those opinions under blind conditions. Treating AI as the object of evaluation, with a rubric fixed in advance, shows you how much of your preference was brand loyalty or recency. It is the same discipline you would apply to a consumer test.",
        needs: [
          "A hypothetical innovation problem that both approaches will tackle",
          "Two approaches: two approved models or tools, or two prompt strategies in one approved tool",
          "Ideally a colleague to anonymize and shuffle the outputs"
        ],
        prompt: `Help me run a blind comparison of two AI approaches. You will help design the test and later the analysis, but you will not judge the outputs. I will. Pause where I say.

Stage 1: Define the task. Here is the problem both approaches will solve:
[DESCRIBE A HYPOTHETICAL INNOVATION PROBLEM IN 3–5 SENTENCES, E.G., “PROPOSE 5 WAYS TO REDUCE PREP TIME FOR A FAMILY DINNER KIT WITHOUT LOSING THE ‘HOME-COOKED’ FEEL.”]
The two approaches I will compare: [E.G., “APPROVED TOOL X VS APPROVED TOOL Y” OR “ZERO-SHOT PROMPT VS STRUCTURED PROMPT WITH EXAMPLES” OR “SINGLE PROMPT VS 3-STEP CHAIN”]

Restate the task so it is identical for both approaches. If I am comparing prompt strategies, write both prompts so they differ only in the strategy being tested. Stop and wait for my approval.

Stage 2: Rubric before results. Draft a scoring rubric with these criteria: quality of reasoning, originality, factual reliability, usefulness for a real team. For each criterion give a 1–5 scale with anchors describing a 1, a 3 and a 5, and a suggested weight. Add a column for “evidence I will look for.” Add one rule: any invented fact, statistic or source automatically caps factual reliability at 2. Stop so I can edit and lock the rubric.

Stage 3: Blind protocol. Give me a short protocol for anonymizing outputs as A and B: strip model names, signature phrases and formatting tells; have a colleague shuffle and keep the key; score A and B independently before comparing.

Stage 4: Analysis (I will paste my scores and the revealed key). Produce a table: Criterion | A score | B score | Difference | My note. Then help me reflect:
1. Where did my blind verdict differ from what I expected?
2. Where did checking facts myself change a score?
3. Three lessons about when to use which approach, each tied to a specific score difference.

Do not claim either approach is generally better; one test is one data point.`,
        steps: [
          "Choose a hypothetical problem and two approaches. Comparing prompt strategies in a single approved tool counts fully.",
          "Run Stages 1 and 2 and lock the rubric before generating anything. Human judgment: weight the criteria for how your team would actually use the output.",
          "Run both approaches on the identical task. Ask a colleague to anonymize the outputs as A and B and keep the key; if no one is available, wait a few hours and shuffle them yourself.",
          "Score A and B against the rubric, checking any factual claims yourself. Only then reveal the key.",
          "Paste scores and the key into Stage 4 and write a scored comparison plus three lessons about when to use which approach."
        ],
        output: "A scored A/B comparison table, made under blind conditions, plus three lessons about when to use each approach.",
        goodLooksLike: [
          "The rubric was written and locked before any outputs existed",
          "The outputs were scored without knowing which approach produced them",
          "At least one score changed after you checked a factual claim yourself",
          "Each of the three lessons points to a specific score difference, not a general impression",
          "You record whether the result confirmed or contradicted your prior preference"
        ],
        doneWhen: "You have a scored blind comparison and three evidence-linked lessons you would share with your team.",
        extension: "Repeat with a different type of task (analytical instead of creative) and see whether the winner changes. Ask: “Given both tests, what kind of task favors approach A?”",
        watchFor: [
          "One run is one sample; AI outputs vary, so a single test cannot prove one approach is better",
          "Formatting, length or tone can reveal the source and break the blinding",
          "AI-generated facts in either output must be verified before you score reliability",
          "Use only approved tools and a hypothetical problem; do not compare tools using confidential inputs"
        ],
        fallback: "With only one basic chat, compare two prompt strategies (for example zero-shot versus structured-with-examples) in separate fresh chats in the same tool, then copy the outputs into a document and have a colleague label them A and B."
      },
      {
          id: "a8",
          slug: "self-critique-loop",
          level: "gofurther",
          square: "Make AI critique and rewrite its own first draft.",
          title: "Run a draft, critique and revise loop",
          category: "AI experimentation",
          time: "25–40 min",
          summary: "Set success criteria first, have AI draft a real work product, critique it against those criteria in a separate step, revise, and judge for yourself whether the loop improved it.",
          why: "Most people accept or lightly edit a first draft, or ask for “make it better” and get something longer. Splitting drafting from critique (often called reflection or prompt chaining) gives the model a narrower job at each step, and running the critique in a fresh chat or as a different reviewer stops it simply agreeing with itself. The real lesson is the comparison at the end: sometimes the loop sharpens a draft and sometimes it only adds words, and you need to be able to tell which.",
          needs: [
            "A real, non-confidential work product you need anyway: a project update, a one-page proposal or an email to leadership",
            "Three to five success criteria written before you open the tool",
            "Your company-approved AI tool, ideally able to open a second fresh chat"
          ],
          prompt: "You are helping me run a draft, critique and revise loop on one real work product. Work in stages and stop where I say. Do not invent facts, figures, names, dates or sources; if the draft needs something I have not given you, insert [NEEDS INPUT: what is missing] instead.\n\nTHE WORK PRODUCT:\nType: [E.G., A ONE-PAGE PROJECT UPDATE, A SHORT PROPOSAL OR AN EMAIL TO LEADERSHIP]\nAudience and what they need to decide or know: [DESCRIBE]\nKey content: [BULLETS OF THE FACTS AND POINTS TO INCLUDE. USE A HYPOTHETICAL OR NON-CONFIDENTIAL VERSION.]\n\nStage 1: Criteria. My success criteria are: [3–5 CRITERIA YOU WROTE BEFORE OPENING THE TOOL, E.G., “THE ASK IS IN THE FIRST TWO LINES”]. Turn each into a 1–5 scoring anchor (what a 1, a 3 and a 5 look like). Suggest at most 2 criteria I may have missed, labeled SUGGESTED. Stop and let me confirm the final list.\n\nStage 2: Draft v1. Write the first draft using only the content I gave you. Stop.\n\nStage 3: Critique. I will ideally paste the criteria and v1 into a fresh chat with this stage only. Act as a demanding reviewer who did not write this draft and owes it nothing. Produce a table: Criterion | Score 1–5 | Evidence (quote the line) | Specific fix. Then list anything stated as fact that is really an assumption, anything the audience would question, and anything to cut. Do not soften scores to be polite; if the draft is already strong on a criterion, say so and propose no change. Stop and let me strike critique points I disagree with.\n\nStage 4: Revise v2. Apply only the critique points I kept. Keep length within 10 percent of v1 unless a criterion requires otherwise. Re-score v2 with the same table and list each change next to the criterion it serves.\n\nStage 5: Honest comparison. Tell me where v2 is worse than v1 or merely longer, and which remaining issues need my judgment or someone with domain expertise rather than another revision pass.",
          steps: [
            "Write your criteria before opening the tool, plus the key content in bullets using non-confidential or hypothetical details.",
            "Run Stages 1 and 2. Human judgment: confirm the scoring anchors match what your audience actually cares about, and drop any suggested criterion that does not.",
            "Open a fresh chat for Stage 3 and paste only the criteria, v1 and the Stage 3 instructions. Human judgment: strike any critique point you disagree with and note why.",
            "Return to the original chat, paste in the critique points you kept, and run Stages 4 and 5.",
            "Read v1 and v2 side by side, ignoring the scores. Write your own 3-line verdict: what improved, what got worse or longer, and whether you would use the loop for this kind of work again."
          ],
          output: "v1, the critique table, v2 and your own 3-line verdict on whether the loop helped.",
          goodLooksLike: [
            "Criteria were written before the first draft and did not change to fit it",
            "Every critique point quotes a specific line and proposes a specific fix, not “could be clearer”",
            "You rejected at least one critique point, with a stated reason",
            "v2 is better on the criteria you weighted most and is no more than about 10 percent longer",
            "Your verdict would hold up if a colleague read both versions without knowing which came first"
          ],
          doneWhen: "You have v1, the critique, v2 and a 3-line verdict stating whether the loop was worth it for this task.",
          extension: "Run a second critique on v2 with a different reviewer role (e.g., a skeptical finance partner or a time-pressed executive). Ask: “Is this round finding real problems or just different preferences?” Note the point where extra passes stop paying off.",
          watchFor: [
            "A critique in the same chat tends to approve its own draft; a fresh chat or different reviewer role reduces this but does not remove it",
            "Revision loops drift toward longer, more hedged text; check that the main point or ask did not get buried",
            "AI cannot check facts it was never given; figures and [NEEDS INPUT] markers still need you",
            "Use non-confidential content only; do not paste unpublished plans or results to make the draft feel realistic"
          ],
          fallback: "In a basic chat with a single conversation, run the stages as separate turns. Before Stage 3, write “Set aside that you wrote this draft. You are a new reviewer seeing it for the first time,” and treat the critique as less independent than a fresh-chat run."
      }
  ]
};
