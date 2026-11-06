# The Developer Files — Detective Portfolio

An interactive portfolio disguised as a detective investigation. Start the game, explore a cork evidence board,
click each pinned item to inspect it, and let Detective Marlowe narrate what he finds.

**Flow:** Start screen → Start Game → evidence board → intro dialogue → drag/explore → click evidence →
zoom + right-hand case file → close → detective comments on what he found.

Built with [Vite](https://vitejs.dev) and plain ES modules (no framework).

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
```

## Controls

- **Drag** the board to explore; it glides to a stop.
- **Scroll** (or pinch on a trackpad/touch screen) to zoom; **Shift + scroll** pans sideways.
- **+ / − / fit buttons** (top right) or the **+ − 0** keys zoom in, out and show the **full board**.
- **Click** any pinned item to inspect it. **Esc** closes the case file.
- The detective's dialogue is one box per part. It never blocks the board and fades away when you drag, scroll or zoom.

## Project structure

```
index.html                 App shell + fonts
public/
  cursors/magnifier.png    Board cursor
  textures/                Cork, wood wall, brick, paper grain, pins, tape, coffee ring
  favicon.svg
src/
  main.js                  Mounts components and wires everything together
  game.js                  Interaction flow (start → inspect → close → dialogue)
  state.js                 Shared game state
  config/profile.js        ★ Your name, role, email, social links
  data/
    evidence.js            ★ Pinned items: position, side-panel content, detective lines
    dialogue.js            ★ Intro dialogue
    decor.js               Non-clickable props (notes, photos, maps…) and marker scribbles
    connections.js         Red-string links between items and props
  components/
    StartScreen.js         Poster, alley scene, Start button
    Board.js               Builds props, evidence items and red strings
    Dialogue.js            Typewriter dialogue box
    SidePanel.js           Right-hand case-file panel
    LinkPreview.js         Hover preview cards for links (spring pop-in)
    SoundToggle.js         Mute button
    ZoomControls.js        Zoom in / out / show full board
    DustCanvas.js          Floating dust particles
  visuals/                 SVG/HTML drawings (evidence, props, thumbnails, previews, alley)
  lib/                     camera.js (drag, wheel, momentum, zoom), audio.js (rain, thunder), dom.js
  utils/torn.js            Random torn-paper edges
  assets/images/           Photos, screenshots, newspaper detective, magnifier
  styles/                  base · animations · board · items · start · hud · dialogue · panel · preview
```

★ = the files you will edit most.

## Customising

- **Your details:** `src/config/profile.js` (name, email, links).
- **Evidence content and detective lines:** `src/data/evidence.js`.
- **Photos and screenshots:** replace files in `src/assets/images/` keeping the same names
  (`suspect-cat.webp` for the mugshot, `previews/*.webp` for hover previews).
- **Add a prop to the board:** add a row to `src/data/decor.js` and, for a new type, a drawing in `src/visuals/props.js`.

## Deploy to GitHub Pages

1. Push to a GitHub repo on the `main` branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds with the correct base path and publishes it.

For other hosts, run `npm run build` and upload `dist/`. For a sub-path, build with `BASE_PATH=/your-path/ npm run build`.

## Notes

- Link previews for GitHub, LeetCode and Ghosted use real screenshots; LinkedIn, Codolio, SafeRoute and Exorcist use stylised cards.
- Rain and thunder are generated with the Web Audio API and start after the Start button (browsers require a click).
