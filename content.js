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
    // Optional: once the site is hosted, paste its real link here so it
    // appears on the printed card. Leave empty ("") until you have one.
    shareUrl: ""
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
    ["messy-notes",      "poke-holes",        "three-expert-panel", "reinvent-a-snack",        "flavor-pairings"],
    ["vibe-code-a-tool", "meeting-prep",      "idea-scorecard",     "workflow-redesign",       "skeptic-rehearsal"],
    ["kinder-email",     "explain-it-twice",  "FREE",               "slide-headline",          "scary-task-checklist"],
    ["feedback-to-experiments", "ten-concepts-kill-seven", "smallest-test", "fridge-dinner",   "research-sprint-design"],
    ["ai-red-team",      "simulated-shoppers", "blind-taste-test-for-ai", "trend-to-opportunity", "team-jam-with-ai"]
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
        slug: "slide-headline",
        level: "explore",
        square: "Give a slide a headline people remember.",
        title: "Give a slide a headline people actually remember",
        category: "Communication",
        time: "5–10 min",
        summary: "Turn a slide’s vague topic title into a headline that states the point, using AI to brainstorm options.",
        why: "Most slide titles name a topic (“Q3 Sensory Results”) instead of saying what the audience should take away. A headline that states the point does half the presenting for you. AI can generate a dozen options in seconds, which makes it easy to spot the one that clicks.",
        needs: [
          "Your company-approved AI chat tool",
          "One slide you’re working on: its current title and the main points on it",
          "Remove confidential details or use a made-up example unless your tool is approved for that information."
        ],
        prompt: `You are a presentation coach who writes slide headlines that state the takeaway, not just the topic.

Here’s my slide:
Current title: [YOUR CURRENT SLIDE TITLE]
What’s on the slide: [PASTE OR DESCRIBE THE KEY POINTS, CHART OR FINDING]
Audience: [WHO WILL SEE IT, E.G., MY DIRECTOR, A CROSS-FUNCTIONAL TEAM]
What I want them to think or do after this slide: [YOUR GOAL]

Please give me 6 headline options, each under 12 words:
- 2 that are clear and direct
- 2 that are a little bolder or more memorable
- 2 that are framed as a question or a surprise

For each, add one line on why it might work.

Rules:
- Only use facts and numbers from what I gave you. Don’t exaggerate the finding.
- If my slide seems to be making more than one point, tell me, and suggest how to split it.

Then ask me which headline I like best so we can polish it.`,
        steps: [
          "Pick a slide from a deck you’re building or recently presented.",
          "Paste the prompt into your AI chat tool and fill in the title, content, audience and goal.",
          "Read the 6 options out loud. The one you’d actually say in the room is usually the winner.",
          "Ask the AI to polish your favorite, or combine two you like.",
          "Put the new headline on your slide and see if the rest of the slide still supports it."
        ],
        output: "A short, takeaway-style headline for your slide that you’d be happy to present.",
        goodLooksLike: [
          "Someone could read only the headline and know the point of the slide",
          "It’s under about 12 words and easy to say out loud",
          "It doesn’t overstate the data",
          "It sounds like you on a good day"
        ],
        doneWhen: "Your slide has a new headline you’d actually present.",
        extension: "Do the same for your whole storyline: paste just your slide titles and ask, “Rewrite these as takeaway headlines so they tell the story in order.”",
        watchFor: [
          "Punchy headlines can overclaim. Make sure the data on the slide supports it.",
          "Catchy isn’t always right for the audience. A leadership review may want plain and clear.",
          "Don’t paste unpublished results or confidential project names unless your tool is approved for them."
        ]
      },
      {
        id: "b5",
        slug: "flavor-pairings",
        level: "explore",
        square: "Invent 5 flavor pairings nobody's tried.",
        title: "Invent 5 flavor pairings nobody’s tried yet",
        category: "Flavor & product play",
        time: "5–10 min",
        summary: "Use AI as a brainstorming partner to dream up five unexpected flavor pairings for a product format you pick.",
        why: "AI has read a lot about food, cultures and ingredients, so it can make connections you might not reach on your own. It’s a fast way to warm up your creative thinking before a real ideation session. You stay the judge, because AI has never tasted anything.",
        needs: [
          "Your company-approved AI chat tool",
          "A product format to play with, such as a granola bar, a yogurt, a snack mix or a cereal",
          "Keep it to public, general ideas; don’t paste formulas, unpublished concepts or pipeline plans."
        ],
        prompt: `You are a creative flavor brainstorming partner with broad knowledge of global cuisines and ingredients.

Product format: [E.G., GRANOLA BAR, YOGURT, SAVORY SNACK MIX, CEREAL]
Occasion or consumer (optional): [E.G., AFTERNOON PICK-ME-UP, KIDS’ LUNCHBOX, ADVENTUROUS SNACKERS]
Anything to avoid (optional): [E.G., NO NUTS, NO SPICY HEAT]

Give me 5 flavor pairings that feel fresh and unexpected for this format. For each:
1. The pairing, with a short catchy name
2. Where the inspiration comes from (a cuisine, a dish, a season)
3. Why the flavors might work together, in one sentence
4. One honest risk or question to test

Rules:
- Don’t claim something has never been done, since you can’t know that. Just aim for unusual.
- Don’t claim health benefits or make nutrition promises.
- Flag any common allergens in each pairing.

Then ask me which 2 I want to push further, or whether I want a wilder round.`,
        steps: [
          "Choose a product format and, if you like, an occasion or consumer to design for.",
          "Paste the prompt into your AI chat tool, fill in the brackets, and send.",
          "Use your own palate and expertise to pick the 2 most intriguing ideas. This is where your judgment matters most.",
          "Ask for a wilder round, or ask the AI to develop your favorites a little further.",
          "Jot your best idea down for a future brainstorm, and remember it’s a starting point, not a recipe."
        ],
        output: "Five unexpected flavor pairing ideas with their inspiration, reasoning and a risk to test for each.",
        goodLooksLike: [
          "At least one idea makes you say “huh, that could be interesting”",
          "Each pairing has a clear reason it might work, not just random words",
          "Allergens are flagged",
          "No health claims or “first ever” claims"
        ],
        doneWhen: "You’ve picked at least one pairing you’d bring to a real brainstorm or mention to a colleague.",
        extension: "Ask for a consumer-facing description: “Write a 2-sentence package-back description for my favorite pairing, with no health claims.”",
        watchFor: [
          "AI doesn’t know if something tastes good. Treat every idea as a hypothesis for real sensory work.",
          "Any idea that goes further needs food-safety, regulatory, allergen and sensory expert review.",
          "AI can’t check whether a pairing already exists in market, so “nobody’s tried” is just for fun.",
          "Keep formulas, unpublished concepts and pipeline plans out of the chat."
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
        slug: "reinvent-a-snack",
        level: "levelup",
        square: "Reinvent a familiar snack 3 radical ways.",
        title: "One snack, three radical reinventions",
        category: "Flavor & product play",
        time: "15–25 min",
        summary: "Take a familiar snack category and push it in three directions: a new format, a new occasion and a new consumer.",
        why: "Incremental ideas come easily; real stretch takes deliberate constraints. Forcing one change at a time (format, occasion, consumer) keeps the exploration disciplined and makes it easier to spot which axis has the most energy. It’s practice for the kind of divergent thinking that early innovation needs.",
        needs: [
          "Your company-approved AI chat tool",
          "A familiar, public snack category, such as granola bars, popcorn or fruit snacks (not unpublished plans)",
          "Something to jot down the ideas you’d actually defend"
        ],
        prompt: `You are a creative product development partner who knows food science basics and consumer trends, and who likes bold ideas grounded in reality.

Snack category: [PICK A FAMILIAR PUBLIC CATEGORY, E.G. GRANOLA BARS]
What people usually love about it today: [2–3 THINGS, IN YOUR OWN WORDS]

Let’s reinvent it in three radical directions, one at a time:
1. New format: change the physical form, texture or eating mechanics.
2. New occasion: move it to a time, place or moment where it rarely shows up today.
3. New consumer: design it for a group who doesn’t usually buy this category.

For each direction, give me 3 concepts. For each concept include: a working name, a one-sentence description, the consumer tension it solves, what has to be true technically for it to work, and a “boldness” rating from 1 (small tweak) to 5 (truly new).

Before moving to the next direction, ask me which concept I find most interesting and why, then build one round of improvements on my choice. Wait for my reply each time.

At the end, give me a short table of my three chosen concepts with the biggest open question for each.

Rules: Don’t invent market sizes, statistics or sources. Label any trend you mention as general observation, not data. Flag where food safety, nutrition, regulatory or legal experts would need to weigh in, especially on health or nutrition claims.`,
        steps: [
          "Choose a public snack category and describe what people like about it today.",
          "Work through each direction, picking your favorite concept and explaining why. Your reasoning steers the next round.",
          "Push back when a concept is too safe or too far-fetched and ask for a bolder or more realistic version.",
          "Review the final table and decide which open question you’d most want answered by a technical expert."
        ],
        output: "Three developed snack concepts, one per direction, each with the key question that would make or break it.",
        goodLooksLike: [
          "At least one concept rated 4 or 5 on boldness that you still find plausible",
          "The three directions feel genuinely different from each other",
          "Each concept names a real consumer tension, not just a novelty",
          "Technical and regulatory questions are flagged rather than glossed over"
        ],
        doneWhen: "You’ve picked one concept per direction and listed the biggest open question for each.",
        extension: "Combine two directions into one concept: “Merge my format idea and my new-consumer idea into a single concept and tell me what new problems that creates.”",
        watchFor: [
          "AI can propose ingredients or processes that aren’t feasible or safe; treat technical claims as starting points for expert review",
          "Any health, nutrition or functional claim needs regulatory, nutrition and legal review before it goes anywhere",
          "Keep to public categories and hypothetical concepts in approved AI tools; don’t paste unpublished pipeline details",
          "Trend references from AI may be outdated or invented, so verify before repeating them"
        ]
      },
      {
        id: "i3",
        slug: "idea-scorecard",
        level: "levelup",
        square: "Build a scorecard. Let your ideas compete.",
        title: "Let your ideas compete on a fair scorecard",
        category: "Innovation practice",
        time: "20–25 min",
        summary: "Define your criteria and weights first, let AI challenge them, then score several ideas and check how sensitive the ranking is.",
        why: "When we score ideas without agreeing on criteria first, the favorite usually wins. Setting weights before scoring, and having them questioned, makes your thinking visible and fairer. A quick sensitivity check shows whether the winner is truly strong or just lucky in how you weighted things.",
        needs: [
          "Your company-approved AI chat tool",
          "3–5 ideas to compare, described in a sentence each (hypothetical or sanitized)",
          "A rough sense of what matters most for your team right now"
        ],
        prompt: `You are a decision coach who helps innovation teams compare ideas fairly. We’ll build a scorecard before we score anything.

Context: [ONE OR TWO SENTENCES ON THE GOAL, E.G. “PICK ONE SNACK CONCEPT TO EXPLORE NEXT QUARTER”]
My ideas (hypothetical or sanitized):
1. [IDEA A]
2. [IDEA B]
3. [IDEA C]
[ADD UP TO 2 MORE]

Step 1: Ask me what matters most for this decision. Then propose 5–6 criteria (for example consumer appeal, technical feasibility, strategic fit, speed to learn, cost to test) with a one-line definition and a suggested weight for each, totaling 100%. Do not look at or score my ideas yet.
Step 2: Challenge my weights. Point out where I might be over- or under-weighting something and ask me to confirm or change them. Wait for my reply.
Step 3: Only after weights are locked, score each idea 1–5 per criterion. Show a table: Idea | each criterion score | weighted total. Give a one-line rationale for every score and mark any score that depends on information you don’t have as “needs input.”
Step 4: Run a sensitivity check. Show how the ranking changes if the top two weights are each shifted by 10 points, and tell me whether the winner is robust or fragile.

Rules: Don’t invent data, market figures or sources. Mark assumptions clearly. Remind me that the final decision belongs to the team and the relevant experts.`,
        steps: [
          "List your ideas and a one-sentence goal, keeping everything hypothetical or sanitized.",
          "Agree on criteria and weights, and take the AI’s challenges seriously before locking them in. This is the main judgment call.",
          "Review the scores and replace any “needs input” scores with your own informed estimate.",
          "Read the sensitivity check and decide whether the ranking is strong enough to act on or needs more evidence."
        ],
        output: "A weighted scorecard ranking your ideas, plus a note on how robust that ranking is.",
        goodLooksLike: [
          "Weights were set and defended before any idea was scored",
          "Every score has a short, readable rationale",
          "The sensitivity check tells you clearly whether the winner holds up",
          "Gaps in knowledge are visible rather than hidden in a number"
        ],
        doneWhen: "You have a final ranked scorecard and know whether the top idea is robust or fragile.",
        extension: "Ask for the cheapest next step to firm up the closest race: “Which single piece of information would most likely change the ranking between my top two ideas?”",
        watchFor: [
          "Numbers can look more precise than the thinking behind them; treat scores as structured opinions",
          "AI may fill unknowns with plausible guesses, so check every “needs input” item",
          "Keep real project names, financials and unpublished plans out unless your approved tool and policy allow it",
          "A scorecard supports a team decision, it doesn’t replace one"
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
        slug: "smallest-test",
        level: "levelup",
        square: "Design the smallest real test of a big idea.",
        title: "Design the smallest real test of a big idea",
        category: "Innovation practice",
        time: "15–20 min",
        summary: "Find the riskiest assumption behind a big idea and design a test you could run in a week, with success and kill criteria set in advance.",
        why: "Big ideas stall when the first step feels as big as the idea itself. Shrinking the question to one risky assumption and one cheap test gets you learning fast. Writing success and kill criteria before you start keeps you honest about what you find.",
        needs: [
          "Your company-approved AI chat tool",
          "A big idea you’d like to move forward (hypothetical or sanitized)",
          "A realistic sense of the time and resources you could spare this week"
        ],
        prompt: `You are a lean experimentation coach. Help me design the smallest real test of a big idea.

The big idea: [DESCRIBE IT IN 2–3 SENTENCES, HYPOTHETICAL OR SANITIZED]
What I have available this week: [E.G. “A FEW HOURS, A SMALL BUDGET, ACCESS TO A PILOT KITCHEN”]
What I can’t do: [E.G. “NO EXTERNAL CONSUMERS WITHOUT APPROVAL”]

Walk me through this, one stage at a time:
1. Ask me 2–3 questions to understand what would have to be true for this idea to succeed. Wait for my answers.
2. List the 5 most important assumptions and help me pick the riskiest one: the one that, if wrong, sinks the idea, and that we know least about. Explain your reasoning and let me overrule you.
3. Propose 3 different tests for that assumption that could run within one week, from scrappiest to most rigorous. For each give: what we’d do, who’s involved, time and effort, and what it can and can’t tell us.
4. After I pick one, help me write a one-page test card: Assumption | Test | Metric or signal | Success criteria | Kill criteria | Date we decide.

Make me commit to the success and kill criteria before the test runs. Don’t invent benchmarks or statistics; if a threshold is a judgment call, say so. Flag any part of the test that needs food safety, regulatory, legal or consumer research approval.`,
        steps: [
          "Describe your idea and your real constraints for the week, keeping details sanitized.",
          "Answer the AI’s questions, then decide which assumption is truly the riskiest. Overrule the AI if your knowledge says otherwise.",
          "Pick one of the three test options based on what you can actually do this week.",
          "Set success and kill criteria yourself before running anything, and put a decision date on the calendar."
        ],
        output: "A one-page test card for a week-long experiment with success and kill criteria agreed in advance.",
        goodLooksLike: [
          "The test targets one assumption, not the whole idea",
          "It can genuinely be done within a week with what you have",
          "Success and kill criteria are specific and written before the test",
          "Required approvals are identified up front"
        ],
        doneWhen: "You have a completed test card and a date when you’ll decide what to do next.",
        extension: "Plan the next step either way: “If the test passes, what’s the next riskiest assumption? If it fails, what’s the most promising pivot?”",
        watchFor: [
          "Small tests answer small questions; don’t over-read the results",
          "Thresholds suggested by AI are not industry benchmarks unless you verify them",
          "Anything involving consumers, food handling or claims needs the right approvals first",
          "Use approved AI tools and keep unpublished plans out of the chat"
        ]
      },
      {
        id: "i7",
        slug: "simulated-shoppers",
        level: "levelup",
        square: "Let 5 simulated shoppers question your concept.",
        title: "Five simulated shoppers, twenty better questions",
        category: "Consumer understanding",
        time: "20–25 min",
        summary: "Have AI role-play five distinct hypothetical shoppers reacting to a concept so you can generate sharper questions to validate with real consumers.",
        why: "Before talking to real consumers, it helps to anticipate the confusions and doubts people might have. Simulated personas are a fast way to widen your perspective and sharpen your interview questions. They are not consumers and not evidence, so the output is a question list, not a finding.",
        needs: [
          "Your company-approved AI chat tool",
          "A hypothetical or sanitized concept described in a few sentences",
          "Access to your approved consumer research channels for the real validation step"
        ],
        prompt: `Important framing: you will role-play simulated, hypothetical shoppers. These are AI personas for brainstorming, not real consumers. Nothing they say is consumer research or evidence. The goal is to generate hypotheses and interview questions that I will validate with real consumers through approved research channels.

My concept (hypothetical or sanitized): [DESCRIBE THE CONCEPT IN 3–4 SENTENCES]
Where it would be sold: [E.G. “GROCERY CEREAL AISLE”]

Step 1: Propose 5 clearly different hypothetical shopper personas relevant to this category (vary life stage, budget, motivations, household and shopping habits). Avoid stereotypes. Give each a one-line sketch and ask me to adjust any before we continue. Wait for my reply.
Step 2: Interview each persona one at a time. Have each one react to the concept in their own voice, then ask the questions, confusions and doubts they might have. Label every response “SIMULATED.”
Step 3: Step out of character and give me:
- A table: Question or confusion | Which personas raised it | Why it might matter | Hypothesis it suggests
- The 10 best open-ended questions to ask real consumers, written in neutral, non-leading language
- A note on what simulated personas are likely to get wrong or miss

Rules: Do not present anything as data, percentages or consumer findings. Don’t invent statistics or sources. Flag any questions touching health, nutrition or claims as needing regulatory and legal review before use with consumers.`,
        steps: [
          "Describe a hypothetical or sanitized concept; never paste unpublished concept boards or consumer data.",
          "Review the five personas and adjust any that feel stereotyped or irrelevant before the interviews start.",
          "Read the simulated reactions as prompts for curiosity, not as findings. Note which questions surprise you.",
          "Edit the final question list with your own judgment and take it to your consumer insights partners for real validation."
        ],
        output: "A list of open, neutral questions and hypotheses to validate with real consumers through approved research channels.",
        goodLooksLike: [
          "Every persona response is clearly labeled as simulated",
          "Personas are genuinely different and avoid stereotypes",
          "Questions are neutral and open, not leading",
          "Nothing is framed as evidence about what consumers think"
        ],
        doneWhen: "You have a reviewed list of questions ready to share with your consumer insights or research partners.",
        extension: "Ask the AI to sort your questions by what to learn first: “Group these questions by which ones would most change our concept if the answer surprised us.”",
        watchFor: [
          "Simulated personas are not consumers; never cite them as research, evidence or insight",
          "AI personas can reflect stereotypes and bias, so review them critically",
          "Real validation must go through approved consumer research channels and processes",
          "Don’t paste consumer personal data or unpublished concepts; use approved AI tools only"
        ]
      },
      {
        id: "i8",
        slug: "trend-to-opportunity",
        level: "levelup",
        square: "Turn an outside trend into 3 GPD opportunities.",
        title: "Turn an outside trend into three GPD opportunities",
        category: "Creativity",
        time: "15–25 min",
        summary: "Bring a public trend, have AI separate signal from hype, then shape three opportunities for GPD and flag what needs verifying.",
        why: "Trends arrive wrapped in hype, and it’s easy to either chase them or dismiss them. Sorting signal from noise before ideating gives you opportunities rooted in something real. Flagging what needs checking keeps you from repeating claims you can’t back up.",
        needs: [
          "Your company-approved AI chat tool",
          "A public trend you’ve noticed, from a news article, trade publication or everyday observation",
          "Any public sources you already have, so you can check them yourself"
        ],
        prompt: `You are a thoughtful trend analyst working with a food product development team. Help me turn an outside trend into grounded opportunities.

The trend: [NAME OR DESCRIBE A PUBLIC TREND, E.G. “PROTEIN IN EVERYTHING” OR “SMALL-PORTION SNACKING”]
Where I saw it: [E.G. “A TRADE ARTICLE, SOCIAL MEDIA, STORE VISITS”]
My team’s focus area: [E.G. “SNACKS, BAKING, CEREAL”]

Please work through this in order:
1. Explain the trend in plain language: what’s driving it, who it affects and what it’s a reaction to. Clearly separate what you know with reasonable confidence from what you’re inferring.
2. Build a table: Claim about the trend | Signal or hype? | Why | How I could verify it. Do not invent statistics, studies, market sizes or sources. If you’re unsure, say “unverified” and suggest what kind of source would confirm it.
3. Ask me which signals feel most relevant to my team. Wait for my answer.
4. Generate 3 opportunities for product development. For each: a working name, the consumer need, how it connects to the trend, what we’d need to believe for it to work, and the first question to verify.
5. End with a “before you share this” checklist of every claim that needs checking against a credible public source or an internal expert.

Flag anything that touches nutrition, health claims, food safety or regulation as requiring expert review.`,
        steps: [
          "Pick a public trend and note where you encountered it.",
          "Review the signal vs hype table and challenge anything that sounds too neat. Your own observations count here.",
          "Choose which signals matter for your team so the opportunities stay relevant.",
          "Work through the verification checklist before sharing any of it, and bring in experts for claims or nutrition questions."
        ],
        output: "Three trend-based opportunities for your team, plus a checklist of claims to verify before sharing.",
        goodLooksLike: [
          "Signal and hype are clearly separated with reasons",
          "No statistics or sources appear that you haven’t verified",
          "Opportunities connect to a real consumer need, not just the trend label",
          "Items needing expert review are clearly flagged"
        ],
        doneWhen: "You have three opportunities and a verification checklist, with at least one claim already checked against a credible public source.",
        extension: "Look at the trend from the other side: “What’s the counter-trend or backlash to this, and is there an opportunity there too?”",
        watchFor: [
          "AI can invent statistics, studies or sources that sound real; verify every figure before you repeat it",
          "AI knowledge may be out of date on fast-moving trends",
          "Health, nutrition and claims-related opportunities need regulatory, nutrition and legal review",
          "Use approved AI tools and keep internal strategy and unpublished plans out of the chat"
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
        slug: "vibe-code-a-tool",
        level: "gofurther",
        square: "Vibe-code a working tool in under an hour.",
        title: "Vibe-code a small working tool",
        category: "AI experimentation",
        time: "45–60 min",
        summary: "Describe the behavior of a small tool in plain language, have AI build it as a runnable prototype, then test it and fix what breaks.",
        why: "Most daily AI users ask for text; far fewer have described a behavior and watched AI turn it into something that runs. Building and then breaking a tiny tool teaches you what AI gets right on the first try, where it silently guesses, and how specific a spec has to be. That instinct carries over to every future conversation with a software team.",
        needs: [
          "An approved AI-supported development environment, or an approved AI tool that can create runnable single-file HTML apps",
          "A small, real annoyance to solve (concept scoring, a sensory-panel tally, a brainstorm randomizer)",
          "Fictional or non-sensitive sample data only"
        ],
        prompt: `You are a careful prototype developer. I want a small working tool built in stages. This is a throwaway prototype with fictional data, not production software.

Stage 1: Clarify. Here is the problem and the behavior I want:
Problem: [ONE OR TWO SENTENCES, E.G., “OUR TEAM SCORES 8–12 CONCEPTS ON 4 CRITERIA IN A SPREADSHEET AND THE MATH KEEPS BREAKING.”]
Who uses it: [E.G., 3–6 PEOPLE IN A WORKSHOP]
Inputs: [E.G., CONCEPT NAMES, 4 CRITERIA, SCORES 1–5, OPTIONAL WEIGHTS]
Outputs: [E.G., RANKED TABLE, WEIGHTED TOTAL, HIGHLIGHT THE TOP 3]
Must not: [E.G., SEND DATA ANYWHERE, NEED A LOGIN, STORE ANYTHING ONLINE]

Before writing code, restate the behavior as a numbered list of requirements, list every assumption you are making, and ask me up to 5 questions about anything ambiguous. Stop and wait for my answers.

Stage 2: Build. After I answer, create a single self-contained HTML file (HTML, CSS and JavaScript in one file, no external libraries, no network calls, no data storage beyond the page). Preload it with 5 rows of obviously fictional sample data. Keep the interface plain and readable.

Stage 3: Test plan. Give me a short test table with columns: Test # | What to do | Expected result. Include at least two edge cases (empty input, ties, out-of-range values).

Stop and wait. I will run the tests and report what actually happened.

Stage 4: Fix. For each bug I report, explain the cause in one plain sentence, then give the corrected full file. Do not add features I did not ask for.

Throughout: if a requirement is risky or you are unsure how something should behave, say so instead of guessing. Remind me that anything going beyond prototype use needs review by the appropriate technical team.`,
        steps: [
          "Pick a problem small enough to finish in an hour. Write the problem, users, inputs, outputs and must-nots before you open the tool.",
          "Paste the prompt into your approved environment and answer its clarifying questions. Human judgment: the questions it asks show where your spec was vague, so fix the spec rather than accepting its defaults.",
          "Save the generated file and open it locally only if your IT policy allows that. Run every test in its test table and add one test of your own.",
          "Report the bugs you actually observed, not ones you assume, and let it fix them. Stop after two fix rounds.",
          "Write a 5-line test log: what you tested, what failed, what was fixed, what still does not work, and whether the tool is worth a real build."
        ],
        output: "A working single-file prototype plus a 5-line test log of what you tested, what broke and what was fixed.",
        goodLooksLike: [
          "Someone else can use the tool for its purpose without you explaining it",
          "The tool passes your own edge-case test, not just the ones AI proposed",
          "The test log records at least one real bug and how it was resolved",
          "You can name one requirement AI got wrong because your spec was ambiguous",
          "No real, confidential or personal data was used at any point"
        ],
        doneWhen: "The prototype runs, passes its test table after fixes, and the 5-line test log is written.",
        extension: "Ask: “Review this file as a skeptical senior developer. List the three things that would break first with 50 real users, and what a production version would need that this one lacks.”",
        watchFor: [
          "A prototype is not production software; it has not been reviewed for security, accessibility or data handling",
          "AI-written code can look right and calculate wrong, so check outputs by hand on a few rows",
          "Use fictional or non-sensitive data only, and open or run files only where IT policy allows",
          "AI fills gaps in your spec with confident guesses that are easy to miss"
        ],
        fallback: "In a basic chat that cannot produce runnable files, run Stages 1 and 3 and ask for a detailed functional spec plus a screen-by-screen clickable-flow description instead of code. If the chat can output a single HTML file and IT allows opening it locally, request that file in Stage 2."
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
        slug: "ten-concepts-kill-seven",
        level: "gofurther",
        square: "Generate 10 concepts. Kill 7. Stress-test 3.",
        title: "Run a concept tournament",
        category: "Innovation practice",
        time: "40–60 min",
        summary: "Generate ten deliberately different concepts, set criteria before ranking, eliminate seven with stated reasons, and stress-test the three survivors.",
        why: "Generating ideas is the easy part of using AI; most people stop there and keep the first few they like. The discipline is in forcing diversity, committing to criteria before you see results, and writing down why ideas die. This turns AI into a sparring partner for convergent thinking, not just a source of options.",
        needs: [
          "A hypothetical opportunity space or brief (no unpublished plans)",
          "Your company-approved AI tool",
          "Three to five criteria you care about, drafted before you start"
        ],
        prompt: `You are running a concept tournament with me. We will diverge, then converge with discipline. Pause where I say.

OPPORTUNITY SPACE:
[DESCRIBE IN 3–5 SENTENCES. USE A HYPOTHETICAL OR NON-CONFIDENTIAL VERSION, E.G., “A SAVORY SNACK FOR ADULTS WHO EAT AT THEIR DESK BETWEEN 2 AND 4 PM.”]
Constraints: [E.G., SHELF-STABLE, AMBIENT DISTRIBUTION, NO NEW CAPITAL EQUIPMENT]

Stage 1: Criteria first. Before generating anything, propose 4–5 evaluation criteria with a one-line definition and a 1–5 scale anchor for each (what a 1 and a 5 look like). Include at least one criterion about consumer need and one about feasibility. Stop and let me edit and weight them. Do not generate concepts yet.

Stage 2: Diverge with constraints. Generate exactly 10 concepts. Enforce diversity: no two concepts may share the same primary benefit, format, AND eating occasion. Include at least 2 that are uncomfortable or unconventional, 2 that are close to existing categories, and 1 that changes the business model or service rather than the product. For each: name, one-sentence description, target consumer, and the main assumption it rests on.

Stage 3: Score and eliminate. Score all 10 against my weighted criteria in a table: Concept | scores per criterion | Weighted total | Confidence (H/M/L). Then eliminate 7. For each eliminated concept, give the specific reason it lost and what would have to be true for it to come back. Stop and let me overrule any eliminations.

Stage 4: Stress-test the 3 survivors. For each:
1. Pre-mortem: it is two years later and it failed. Give the three most plausible reasons.
2. Edge cases: consumers, uses or conditions where it breaks.
3. What must be true: the 3 conditions that have to hold for it to succeed, each labeled EVIDENCE or ASSUMPTION.
4. The cheapest test that could disprove it.

Do not invent market data, consumer statistics or competitor facts. Flag anything about formulation, safety or claims that needs expert review.`,
        steps: [
          "Write your opportunity space and constraints in hypothetical terms, and jot your own criteria before opening the tool.",
          "Run Stage 1. Human judgment: set the weights yourself. The tournament is only as good as criteria you committed to before seeing the concepts.",
          "Run Stages 2 and 3. Overrule at least one elimination if you disagree, and note why; that disagreement is data about your criteria.",
          "Run Stage 4 and read the pre-mortems critically. Mark which “what must be true” conditions you could actually test in the next month.",
          "Assemble a concept tournament table: all 10 concepts, scores, elimination reasons, and the stress-test summary for the final 3."
        ],
        output: "A concept tournament table showing 10 concepts, criteria scores, reasons for each elimination and stress tests for the 3 survivors.",
        goodLooksLike: [
          "The 10 concepts are genuinely different; you could not merge any two without losing something",
          "Criteria and weights were fixed before scoring and did not change to favor a concept you liked",
          "Every elimination has a specific reason, not “weaker overall”",
          "Each survivor has at least one disprovable assumption and a cheap test for it",
          "No invented market sizes, statistics or competitor claims appear in the table"
        ],
        doneWhen: "The tournament table is complete and you can explain in one sentence why each of the three survivors earned its place.",
        extension: "Swap one criterion for its opposite (e.g., “easy to make” becomes “hard for competitors to copy”) and re-score. Ask: “Which concepts moved the most, and what does that say about our criteria?”",
        watchFor: [
          "AI scores are opinions dressed as numbers; consistency matters more than precision",
          "Concepts may unknowingly resemble existing products or protected ideas, so check before sharing widely",
          "Formulation, nutrition, safety and claim feasibility need validation by qualified experts",
          "Keep the opportunity space hypothetical; do not paste unpublished briefs or plans"
        ],
        fallback: "This runs in any basic chat. If the tool loses track of the table, paste the current table back in at the start of each stage."
      },
      {
        id: "a5",
        slug: "research-sprint-design",
        level: "gofurther",
        square: "Design a research sprint with AI as your analyst.",
        title: "Design an AI-assisted research sprint",
        category: "Consumer understanding",
        time: "40–60 min",
        summary: "Design a short research sprint in which AI drafts the desk-research plan, interview guide and coding scheme, while real consumers, approved partners and source checks supply the truth.",
        why: "AI is fast at research scaffolding and unreliable at research facts, and daily users often blur the two. Designing a sprint that assigns each job to the right party (AI, a human researcher, real consumers, verified sources) is a skill on its own. You end up with a plan that is faster to run and harder to fool.",
        needs: [
          "A research question framed hypothetically or without confidential detail",
          "Your company-approved AI tool; web or deep-research features only if your approved tool includes them",
          "Awareness of your organization’s approved research partners and consumer research policies"
        ],
        prompt: `You are a senior consumer insights lead helping me design a 2-week research sprint. Your job is to design the method and draft materials, not to supply findings. Never invent data, statistics, quotes, studies or citations. If you mention a source, say whether it is something I must locate and verify.

RESEARCH QUESTION:
[STATE THE QUESTION IN 1–2 SENTENCES. USE A HYPOTHETICAL OR NON-CONFIDENTIAL VERSION, E.G., “WHY DO PARENTS OF TEENS STOP BUYING BREAKFAST BARS?”]
Decision this research informs: [WHAT WILL CHANGE BASED ON THE ANSWER]
What we already believe: [HYPOTHESES, LABELED AS SUCH]

Stage 1: Sharpen. Break the question into 3–5 sub-questions. For each, say what kind of evidence would answer it (published data, expert input, consumer behavior, consumer attitudes). Stop and let me edit.

Stage 2: Division of labor. Produce a table: Sub-question | What AI can draft or synthesize | What requires real consumers | What requires an approved research partner | What requires source verification by a person.

Stage 3: Desk research plan. List the types of sources to look for (not specific invented titles), search terms, and how to judge source quality. If I have a web or deep-research tool, explain how I should use it and how to check that each cited source exists and says what is claimed.

Stage 4: Draft materials.
1. A 30-minute interview guide with a warm-up, 8–10 open questions, and probes. Avoid leading questions.
2. A starter coding scheme for qualitative data: 6–10 codes with definitions and an example of what would and would not count.

Stage 5: Verification checklist. A checklist I must complete before any finding is shared, covering source existence, quote accuracy, sample limitations, AI-drafted versus consumer-sourced content, and privacy rules for consumer data.

Mark every item that needs approval from insights, legal or privacy teams.`,
        steps: [
          "Write a research question and the decision it informs, keeping details hypothetical or non-confidential.",
          "Run Stages 1 and 2. Human judgment: the division-of-labor table is the core of the plan, so move anything that depends on real consumer truth out of the AI column.",
          "Run Stage 3. If your approved tool has web or deep-research features, try one search and open every cited source yourself to confirm it exists and supports the claim.",
          "Run Stages 4 and 5. Review the interview guide for leading questions and check the coding scheme against how your insights team works.",
          "Compile a one-page research plan: question, sub-questions, division of labor, materials list and verification checklist."
        ],
        output: "A one-page research sprint plan with a division-of-labor table and a verification checklist.",
        goodLooksLike: [
          "The plan clearly separates AI drafting from evidence that must come from real consumers or verified sources",
          "No citation, statistic or quote in the plan was produced by AI without a person verifying it",
          "An insights colleague would run the interview guide with minor edits, not a rewrite",
          "The coding scheme has definitions precise enough that two people would code the same quote the same way",
          "The verification checklist could be used as a real gate before sharing findings"
        ],
        doneWhen: "You have a one-page plan whose verification checklist an insights colleague agrees is usable.",
        extension: "Ask: “Role-play three very different interviewees answering question 4, then tell me which of my probes failed to get past a surface answer.” Treat the role-play as a way to test the guide, never as data.",
        watchFor: [
          "AI can fabricate citations, statistics and quotes that look real; verify every source by opening it",
          "Simulated consumer responses are not consumer research and must never be reported as findings",
          "Consumer personal data must follow privacy policies and stay out of unapproved tools",
          "Research design choices should be reviewed by insights professionals before fieldwork"
        ],
        fallback: "In a chat-only tool without web access, skip the search part of Stage 3 and ask for a list of source types and search terms you will run yourself. Everything else in the prompt works as written."
      },
      {
        id: "a6",
        slug: "ai-red-team",
        level: "gofurther",
        square: "Send your strategy through an AI red team.",
        title: "Red-team a strategy with AI",
        category: "Critical thinking",
        time: "40–60 min",
        summary: "Put a sanitized strategy in front of five AI adversaries, rank their attacks by severity and likelihood, and set defenses and tripwires for the top five.",
        why: "Most people ask AI to improve a plan, which mostly polishes it. A red team asks it to defeat the plan, which surfaces the weaknesses you are motivated not to see. Pairing every vulnerability with a tripwire turns criticism into an early-warning system.",
        needs: [
          "A hypothetical or sanitized strategy summary (one paragraph, no confidential numbers or unpublished plans)",
          "Your company-approved AI tool",
          "Optionally, a colleague to challenge the final ranking"
        ],
        prompt: `You are running a red-team exercise against a strategy. Your goal is to find how it fails, not to improve its wording. Pause where I say.

THE STRATEGY:
[SUMMARIZE IN 5–8 SENTENCES: GOAL, TARGET CONSUMER, CORE MOVES, TIMELINE. USE A HYPOTHETICAL OR SANITIZED VERSION WITH NO CONFIDENTIAL FIGURES.]
What success looks like in 3 years: [ONE OR TWO SENTENCES]

Stage 1: Attacks. Write five separate attacks, each in the voice of one adversary. Each gives its 3 strongest lines of attack.
1. A competitor’s strategist planning how to neutralize this.
2. A skeptical CFO who must fund it.
3. A regulator or standards body reviewing claims, labeling or safety.
4. A disappointed consumer who tried it once and stopped.
5. The world in 3 years: shifts in technology, behavior, economics or retail that make this obsolete.
Be specific. No generic risks like “execution risk.” Label each point EVIDENCE (from what I provided or widely established) or ASSUMPTION. Do not invent statistics, regulations or competitor facts; where a specific regulation might apply, say “check with regulatory” instead of naming one.

Stop and ask me which attacks I can already answer.

Stage 2: Rank. Combine all attacks into one table: # | Vulnerability | Adversary | Severity (1–5) | Likelihood (1–5) | Score (S x L) | Rationale. Sort by score. Mark scores with low confidence.

Stage 3: Defend. For the top 5 vulnerabilities, give:
1. Mitigation: what we could change now.
2. Tripwire: an observable signal that would tell us this risk is materializing, with a threshold and who would watch it.
3. Response: what we would do if the tripwire fires.

Stage 4: Honesty check. Name the one vulnerability you think I am most likely to underrate, and why.

Flag anything needing legal, regulatory, finance or food-safety expert review.`,
        steps: [
          "Write a sanitized version of a strategy: real enough to be interesting, stripped of confidential figures, names and unpublished plans.",
          "Run Stage 1. Human judgment: note which attacks you dismissed immediately. Those are worth a second look before you move on.",
          "Run Stages 2 and 3. Re-score severity and likelihood yourself where you disagree; AI’s ratings are a starting point, not a verdict.",
          "Run Stage 4, then ask a colleague to review the top 5 and the tripwires for realism.",
          "Write a red-team report: the strategy summary, the ranked table, and the top 5 vulnerabilities with mitigation, tripwire and response for each."
        ],
        output: "A red-team report listing the top 5 vulnerabilities, each with a mitigation, a measurable tripwire and a planned response.",
        goodLooksLike: [
          "At least one vulnerability is something you had not seriously considered before",
          "Every tripwire is observable, has a threshold, and names who would notice it",
          "Severity and likelihood scores reflect your judgment, with your changes to AI’s scores visible",
          "No invented regulations, competitor moves or figures appear as fact",
          "The report would change at least one decision or plan for monitoring"
        ],
        doneWhen: "Your report has five ranked vulnerabilities, each with a mitigation and tripwire that a colleague agrees are realistic.",
        extension: "Run the red team again on your mitigated strategy and ask: “Which of my defenses created a new vulnerability?”",
        watchFor: [
          "AI adversaries are simulations; real competitors, regulators and consumers will behave differently",
          "Regulatory and legal points must be confirmed with qualified experts, not taken from AI",
          "Strategy details are sensitive; use sanitized versions and approved tools only",
          "Severity and likelihood numbers look precise but are judgment calls"
        ],
        fallback: "This runs fully in a basic chat. For more independent attacks, run each adversary in its own fresh chat and paste the five outputs into one chat for Stages 2–4."
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
        slug: "team-jam-with-ai",
        level: "gofurther",
        square: "Run a team jam with AI as a seat at the table.",
        title: "Run a team jam with AI at the table",
        category: "Innovation practice",
        time: "45–60 min",
        summary: "Design and run a 30–45 minute working session where 3–6 colleagues and AI each play defined roles, then debrief on what AI added and what it distorted.",
        why: "Almost all AI use is one person and one chat window. Putting AI into a live group changes the dynamics: it can break anchoring and fill silence, but it can also flatten discussion or get treated as an authority. Designing the rules of engagement on purpose is a skill few teams have practiced.",
        needs: [
          "3–6 colleagues and 30–45 minutes",
          "One shared screen running your company-approved AI tool, operated by a single facilitator",
          "A hypothetical or non-confidential challenge to work on"
        ],
        prompt: `You are helping me design a 30–45 minute team working session where AI is one participant among 3–6 people. I will run the AI from one shared screen. No personal accounts, integrations or automated actions are involved. Pause where I say.

THE SESSION:
Challenge: [DESCRIBE IN 2–3 SENTENCES. USE A HYPOTHETICAL OR NON-CONFIDENTIAL CHALLENGE, E.G., “HOW MIGHT WE MAKE OUR WEEKLY PROJECT STAND-UP MORE USEFUL?”]
Participants: [NUMBER AND ROLES, NO NAMES NEEDED]
Desired output: [E.G., 3 IDEAS TO TRY NEXT MONTH]

Stage 1: Roles. Propose 3 roles AI could play in this session (for example provocateur, synthesizer or note-taker, devil’s advocate). For each: what it does, when it is invoked, the exact short prompt the facilitator would type, and one way that role could go wrong in a group. Stop and let me choose.

Stage 2: Run-of-show. Build a minute-by-minute agenda table: Time | Round | Human-only or AI-assisted | What happens | Facilitator prompt (if AI). Requirements:
1. Start with a human-only round so AI does not anchor the group.
2. Include at least one round where AI challenges the group’s favorite idea.
3. End with a human-only decision round.

Stage 3: Ground rules. Write 5 short rules the facilitator reads out at the start, including: when humans override AI, how to treat AI claims of fact (unverified until checked), what not to type into the tool (confidential information, personal data), and who decides.

Stage 4: Debrief. Write 6 debrief questions covering what AI added, what it distorted or flattened, whether anyone deferred to it too much, and whether we would use it the same way again.

Stage 5: Playbook. Package Stages 1–4 into a one-page reusable session playbook another facilitator could run without me.

Do not include any steps that send messages, schedule meetings or act outside this chat.`,
        steps: [
          "Run the prompt to design the session, choose AI’s roles, and adjust the run-of-show to your team’s habits.",
          "Run the session. Only the facilitator types into the approved AI tool on the shared screen; nobody connects personal accounts or automates anything.",
          "Human judgment: during the session, enforce the override rule out loud whenever the group starts deferring to AI or treating its claims as fact.",
          "Hold the debrief using the generated questions and capture answers in plain notes.",
          "Update the playbook with what you learned and save it alongside your debrief notes."
        ],
        output: "A reusable one-page session playbook plus debrief notes from a real run with your team.",
        goodLooksLike: [
          "The run-of-show has clear human-only rounds, including the opening and the final decision",
          "The debrief names at least one thing AI added and one thing it distorted",
          "Someone who was not there could run the session from the playbook alone",
          "Participants could say who made the final decision, and it was a person",
          "No confidential data was entered and no external action was taken"
        ],
        doneWhen: "You have run the session once and saved a playbook updated with your debrief notes.",
        extension: "Run the same playbook with a different team and compare debriefs. Ask AI: “Here are two debriefs. What pattern suggests where AI helps groups and where it gets in the way?”",
        watchFor: [
          "Groups can defer to AI as an authority; its contributions are prompts for discussion, not answers",
          "AI may confidently state facts during the session that need checking afterward",
          "Never type confidential information or colleagues’ personal details into the tool",
          "Do not connect personal accounts, integrations or automations to run the session"
        ],
        fallback: "This needs only a basic chat on a shared screen. If screen sharing is not practical, the facilitator can read AI’s responses aloud and paste the group’s inputs back in."
      }
  ]
};
