# Cereal Kingdom

A small 3D adventure for the *Lessons from the Frontier* session, made with AI. It runs in any modern browser, on phones (touch), laptops (keyboard) and with a game controller. No sign-in, no installs.

**Live at:** https://janvi618.github.io/gpd-ai-bingo/cereal-kingdom/

## The quest (about 3 minutes)

1. Talk to **Mayor Oatley** in Ring Village.
2. Win back the three **Golden Rings** from Oat Meadow, Marshmallow Mountain and the Cocoa Caves. Defeat the soggies guarding each ring, then walk into it. The golden beam and the compass at the top of the screen always point to the next goal.
3. Beat **the Great Sog** at Milk Beach. Step out of the red circles before he slams down.

You level up as you pop soggies (more health, and a stronger spoon every other level). Berries heal. If you get soggy, you're sent back to the village with full health and keep your progress.

## Controls

| | Phone | Laptop | Controller |
|---|---|---|---|
| Move | Left thumb, anywhere on the left half | WASD or arrows | Left stick |
| Attack (hold to keep swinging; 3 fast hits = spin) | Red button | J, Space or click | A |
| Dash (dodges hits) | Blue button | K or Shift | B |
| Crunch Burst (when the meter glows) | Burst button | L or Q | X |
| Talk | Talk button | E | Y |
| Pause | Pause button | P or Esc | Start |

## Settings

Graphics: **Fast**, **Balanced** (default on phones) or **Best** (default on laptops, adds real-time shadows). If a device struggles, the game drops to a faster setting by itself.

## Files

`index.html` (page and screens, fonts built in), `game.js` (the game), `terrain.js` (island shape and colors), `audio.js` (music and sound, generated live), `vendor/three.module.min.js` (Three.js r169, MIT License, see `vendor/three-LICENSE.txt`). Nothing loads from outside this folder.

Adding `?debug` to the address shows a frame counter and a `K` object in the browser console for testing (for example `K.boss()` jumps to the boss fight).

## Credits

All characters, places and story are original. Fonts: Fraunces and DM Sans (SIL Open Font License 1.1). 3D engine: Three.js (MIT License).
