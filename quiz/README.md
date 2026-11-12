# The 3-question innovation quiz

A quick booth quiz at `https://janvi618.github.io/gpd-ai-bingo/quiz/`. It is separate from the Bingo site and shares no files with it.

- Each player gets 3 of the 18 questions at random, with the answers shuffled.
- After each answer, the page shows the right one and a one-line fact.
- The last screen shows the score, "Show this screen at the booth," and the time, so a screenshot can't be reused.
- Replays bring new questions. There are no names, no leaderboard and no network calls.

To change the questions, edit the `QUESTIONS` list at the top of the script in `index.html`. The correct answer goes first; the page shuffles them. `qr.svg` and `qr.png` are QR codes for the quiz address.
