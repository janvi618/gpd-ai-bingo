# The 5-question innovation quiz

A quick booth quiz at `https://janvi618.github.io/gpd-ai-bingo/quiz/`. It is separate from the Bingo site and shares no files with it.

- Each player gets 5 of the 18 questions at random, with the answers shuffled.
- After each answer, the page shows the right one and a one-line fact.
- **A perfect score wins a book, for the first 10 winners.** The winner's screen says "You won the book!", shows "Winner 7 of 10" and the time, and tells them to show it at the booth. After 10, a perfect score says all the books have been claimed.
- **One try per phone.** There is no replay button, and reloading the page continues the same game or shows the same result. This limits a phone, not a person: a second phone or a private browser window gets another try.

## For booth staff

Open the quiz with `?staff` on the end (`.../quiz/?staff`) to see how many books have been claimed and when. The same page has **Reset the book count** (tap twice) and **Let this phone play again**. After testing, reset the count before the fair opens, and use the second button on any phone you tested with.

The count is shared between phones through ntfy.sh and lasts about 12 hours. If a phone can't reach it, a perfect score shows "Show this screen at the booth" with the time instead of a winner number, and the booth decides.

## Changing it

In `index.html`, the `QUESTIONS` list is at the top of the script (the correct answer goes first; the page shuffles them). `PER_GAME` is the number of questions in a game and `BOOKS` is the number of books. `qr.svg` and `qr.png` are QR codes for the quiz address.
