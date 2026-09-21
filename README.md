# Bubble Blast

A single-level, Super Pang-inspired browser arcade game. Move beneath bouncing AI icons and fire vertical energy harpoons. Large targets split into medium targets, medium targets split into small targets, and small targets disappear when hit. Clear the arena before your lives or timer run out.

The game uses original, procedurally drawn Copilot-inspired artwork, not official logos. It is not affiliated with Microsoft or the creators of Super Pang. The repository is named `Bubble-Blaster`; the game's display name is **Bubble Blast**.

## Prerequisites

- A modern browser with JavaScript enabled, Canvas 2D, and Pointer Events support.
- VS Code if you want to inspect or edit the source.
- A touch-capable device for validating simultaneous touch controls.

There are no package dependencies, downloaded artwork, credentials, backend, AI API calls, or required external services. Node.js, npm, Python, and VS Code extensions are not required.

## Open and run locally in VS Code

1. Download and extract the repository, or use an existing local checkout of `main`.
2. In VS Code, choose **File > Open Folder** and select the folder containing `index.html`, `styles.css`, `icons.js`, `game.js`, and this README. Do not open only an individual file or the folder's parent.
3. No terminal commands are needed for setup, build, or launch. If you open VS Code's integrated terminal, its working directory should be that repository root, not a parent directory.
4. Open the root `index.html` in your browser using the browser's **Open File** action or your operating system's file manager. VS Code's text editor preview is not the game runtime.
5. Expect a styled arena, a ready message, and an enabled **Start game** button. Click it to begin. Reload the browser after saving source changes.

This launch procedure follows the source's relative stylesheet and deferred classic-script references; no server or module loader is required by the implementation. Browser execution has not been verified as part of repository inspection.

## Controls and rules

- **Move:** Left/Right arrows or A/D while the canvas has keyboard focus. Starting or restarting focuses the canvas. If you move focus elsewhere, click the canvas to resume keyboard input.
- **Fire:** Tap or hold Space with the canvas focused.
- **Touch or mouse:** Hold an on-screen direction button; tap or hold Fire. Touch supports holding movement and Fire together.
- **Restart:** Click **Restart game** during or after a round to reset the level.

Each round starts with two large targets, three lives, 90 seconds, zero points, and two seconds of damage protection. Hits award 100 points for a large target, 200 for a medium target, and 300 for a small target. The harpoon rises vertically, with at most two shots active and a short firing cooldown.

Touching a target costs one life when protection is inactive. Damage grants another two seconds of protection, indicated by the player's flashing color. Clear all targets to win; reaching zero lives or time ends the round. The status below the arena reports the outcome.

Held inputs clear when the browser window loses focus. Simulation does not advance while the document is hidden; returning to the tab requires pressing the controls again. The timer follows simulation time, which is capped per frame, rather than guaranteeing wall-clock timing under heavy browser load.

## Source layout

| File | Purpose |
| --- | --- |
| `index.html` | Canvas, HUD, instructions, start/restart button, and on-screen controls. |
| `styles.css` | Responsive layout, focus indicators, and touch-control styling. |
| `icons.js` | Exposes `BubbleBlastIcons.draw(ctx, x, y, radius, rotation)` for original Canvas artwork; rotation is optional and in radians. |
| `game.js` | Input, physics, collisions, scoring, round state, and rendering. |
| `README.md` | Local setup and validation guidance. |

`index.html` loads `icons.js` before `game.js`. Keep all five files together and preserve the page's element IDs when changing the interface.

## Testing and expected results

There is no automated test suite, test command, package manifest, or build configuration in this repository. Do not assume `npm install`, `npm start`, or `npm test` exists. Source inspection is not a passing runtime test.

Perform these manual checks in a browser after opening the folder in VS Code. None requires Exchange, an AI service, credentials, or another external environment.

| Check | Action and expected result |
| --- | --- |
| Startup | Open `index.html` and browser developer tools. Expect styled content, a ready message, enabled controls, and no missing local assets or JavaScript errors. |
| Round reset | Start, then restart after moving and scoring. Expect two large targets, centered player, score 0, lives 3, and a timer starting at 90. |
| Keyboard | With the canvas focused, test arrows, A/D, and Space. Expect bounded horizontal movement and vertical harpoons; holding Fire should repeat without exceeding two active shots. |
| Splitting and score | Hit each target size. Expect large to split into two medium targets (+100), medium into two small targets (+200), and small to disappear (+300). |
| Bouncing | Observe targets over several bounces. Expect them to remain inside the arena and rebound from side walls and floor. |
| Damage | After protection expires, touch a target. Expect exactly one life lost and flashing protection against immediate repeat damage. Further unprotected hits should end the round at zero lives. |
| Victory | Clear every target. Expect a level-cleared status, stopped simulation, and a final score of 3400 for the full initial target tree. Restart should work afterward. |
| Timeout | Keep at least one target alive and avoid losing all lives until time reaches zero. Expect a time-expired status and stopped simulation. This requires a separate survival attempt. |
| Input cleanup | Hold movement, then switch tabs and release. Return and expect no stuck movement or hidden-tab timer catch-up; press controls again to continue. |
| Touch | On a touch-capable device, hold a direction and Fire with separate fingers. Expect movement and repeated shots together. Release each finger and verify its action stops; dragging off a captured control and releasing must not leave it held. |
| Layout and focus | Check narrow and wide windows, keyboard Tab navigation, readable HUD, visible focus, and proportional canvas rendering. Touch buttons should not scroll the page while held; normal content should still scroll. |

Record the browser/device, observed result, and any console errors when reporting a defect. Gameplay balance, full win/loss playthroughs, browser compatibility, and real-device touch behavior remain unverified until these checks are performed.

## Merge history

<!-- bumblebee-pr-1 -->
### Merged change: Create Bubble Blast game page and control interface

Merged pull request #1: https://github.com/MarcoLFrancisco/Bubble-Blaster/pull/1

Files in the approved proposal:
- index.html

Bumblebee has not run automated tests or verified runtime behavior for this change.


<!-- bumblebee-pr-3 -->
### Merged change: Add responsive arcade styling and accessible game controls

Merged pull request #3: https://github.com/MarcoLFrancisco/Bubble-Blaster/pull/3

Files in the approved proposal:
- styles.css

Bumblebee has not run automated tests or verified runtime behavior for this change.


<!-- bumblebee-pr-5 -->
### Merged change: Add procedural Copilot-inspired AI target artwork

Merged pull request #5: https://github.com/MarcoLFrancisco/Bubble-Blaster/pull/5

Files in the approved proposal:
- icons.js

Bumblebee has not run automated tests or verified runtime behavior for this change.


<!-- bumblebee-pr-7 -->
### Merged change: Implement Bubble Blast single-level gameplay

Merged pull request #7: https://github.com/MarcoLFrancisco/Bubble-Blaster/pull/7

Files in the approved proposal:
- game.js

Bumblebee has not run automated tests or verified runtime behavior for this change.


<!-- bumblebee-pr-9 -->
### Merged change: Document Bubble Blast setup, controls, and manual validation

Merged pull request #9: https://github.com/MarcoLFrancisco/Bubble-Blaster/pull/9

Files in the approved proposal:
- README.md

Bumblebee has not run automated tests or verified runtime behavior for this change.
