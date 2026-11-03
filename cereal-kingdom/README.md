# Cereal Kingdom

A 2-minute 3D score attack for the *Lessons from the Frontier* session, made with AI. Players scan a QR code, type a name and play on their phones (touch), a laptop (keyboard) or with a game controller. A live leaderboard on the big screen shows the top 10.

- **Play:** https://janvi618.github.io/gpd-ai-bingo/cereal-kingdom/
- **Big-screen leaderboard (with the QR code):** https://janvi618.github.io/gpd-ai-bingo/cereal-kingdom/board.html
- **QR code image:** `qr-code.png` in this folder

## How a run works

A 3-2-1 countdown, then 2 minutes. Soggies keep coming to you; pop them with your spoon.

| | Points |
|---|---|
| Soggy | 10 (Sog Knight 30) |
| Combo | Pop soggies quickly in a row for ×2, ×3 and ×4 |
| Crunch bit | 5 |
| Golden Ring (clear its guards, then walk into it) | 150 each, three on the island |
| The Great Sog (arrives with 45 seconds left) | 400 |

If you get soggy you're back in 2 seconds where you fell. Each phone's best run counts on the leaderboard.

## Controls

| | Phone | Laptop | Controller |
|---|---|---|---|
| Move | Left thumb | WASD or arrows | Left stick |
| Attack (hold to keep swinging; 3 fast hits = spin) | Red button | J, Space or click | A |
| Dash | Blue button | K or Shift | B |
| Crunch Burst (when it glows) | Burst button | L or Q | X |
| Pause | Pause button | P or Esc | Start |

## Running the leaderboard

Open `board.html` on the presenting laptop and make it full screen. It updates every few seconds.

- **New round** (bottom right, click twice) clears the board, for example after a test run.
- **Add a score by hand**: if a phone can't connect, its results screen shows the name, score and a 5-character code. Type those in and the board checks the code.

Scores travel through **ntfy.sh**, a free public message relay, on a topic only this game uses. Nothing is stored for more than 12 hours, and only the name and score are sent, so ask people to use a first name or nickname. To run a separate leaderboard, add `?board=any-new-name` to both the game link and the board link.

## Files

`index.html`, `game.js`, `terrain.js`, `audio.js` (the game), `board.html` (the leaderboard), `qr-code.png`, and `vendor/three.module.min.js` (Three.js r169, MIT License). Adding `?debug` to the game address shows a frame counter and a `K` object in the browser console for testing.

## Credits

All characters, places and story are original. Fonts: Fraunces and DM Sans (SIL Open Font License 1.1). 3D engine: Three.js (MIT License). Score relay: ntfy.sh.
