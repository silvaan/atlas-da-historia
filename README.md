# History Atlas
A 3D world map (three.js), with a zoom that goes from the whole planet down to the people in a city's streets.
It is the base of the map. The historical network layer (events linked across places and periods) does not exist yet.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # builds dist/ ; `npm run preview` serves the build
npm run grid       # regenerates public/world.bin from the Natural Earth coastlines
```

## Controls

Dragging moves the map. The mouse wheel or a pinch zooms at the cursor, and a double click zooms in.
The site opens on the globe, in 12,000 BC (the foragers chapter). The URL keeps the year (`#year=1808`) or the event (`#cabral`).

Keys: ← and → go to the previous/next event; Shift+← and Shift+→ (or PageUp/PageDown) change chapter; Space plays the timeline; 1, 2, 3 and 4 switch the view (top-down, tilted, isometric, globe); Q and E rotate; WASD move; + and − change the zoom.

## How it is organized

- `scripts/build-grid.mjs`: rasterizes the land into 0.5° squares (720×288) and assigns biomes and relief by rules and noise.
- `src/data/`: grid, palette, rivers and the three sample periods (`eras.js`, hand-drawn outlines, provisional).
- `src/world/`: block terrain (a single mesh), borders, rivers and roads, cities, nature and travelers, all instanced.
- `src/view/`: orthographic camera with the three views and the HTML labels.
- `src/main.js`: puts everything together and decides what shows at each zoom (pixels per square):

| zoom (px/square) | shows |
|---|---|
| always | terrain, mountains, empire colors (stronger from afar) |
| ≥ 7 | trees |
| ≥ 5 | houses; fields from 8 |
| ≥ 10 | carts, caravans, ships; the border gets thin |
| ≥ 40 | people |

## Living map (year by year)

- `src/data/history.js` → `eraAt(year)`: borders from the key map in force + cities founded, growing or destroyed in that exact year (`FOUNDED`, `ENDED`, `BETWEEN`), roads and routes with their opening year.
- `src/data/landmarks.js` + `src/world/landmarks.js`: monuments (pyramids, the Great Wall, Hagia Sophia…) that appear in the year they were finished and later become ruins or disappear.
- `src/data/anims.js` + `src/world/fx.js`: one short animation per event (fleet, founding, battle, revolt, ceremony, treaty, epidemic, sugar mill, gold, industry, earthquake, flight, wheel, cargo, crossing). It loops when the event is selected; during the timeline's ▶, each event that arrives pulses and plays once.
- `src/world/ambient.js`: clouds (from afar), sea swell, chimney smoke and birds (up close). Fishing canoes live in `agents.js`.

Checks: `node scripts/check-agents.mjs` (travelers, every 15 years) and `node scripts/check-fx.mjs` (nobody in the water and no ship on land in any animation).

## Globe, routes and deep time

- **Globe** ("Globe" button or key 4): the world of the current year painted on a sphere, with borders, cities, routes and the voyage of the chosen event (`src/view/globe.js`). If you zoom out past the whole map, the globe opens by itself. Zooming all the way in, or double-clicking a point, returns to the map at that place.
- **Voyages** (`src/data/voyages.js` + `src/world/voyages.js`): when you choose an event with a voyage (Cabral, Gama, the court...), the route is drawn with a ship at its tip and the stops appear with their names. When the drawing ends, the camera comes down to the arrival, unless you have already moved the map. "⛵ Show the route" replays it.
- **Lines with a minimum width in pixels** (`src/world/flowline.js`): sea routes, roads and voyages stay visible with the whole world on screen. The dashes move in the direction of travel.
- **Monuments** shrink as you zoom out (they grow only with the square root of the zoom), instead of keeping the same size on screen.
- **Timeline in segments** (`THREAD.scale`): deep time (before 1450) is compressed on the left, and ▶ moves faster through those segments. Negative years show as "BC".
- `scripts/build-countries.mjs` builds `src/data/countries.js` (present-day outlines, Natural Earth 1:110m), the base for the 19th- and 20th-century borders.

## Chapters and board pieces

- **Chapters** (`CHAPTERS` in `src/data/history.js`): the thread is split into 13 periods of world history (from the foragers to the Cold War), each with an opening text (`txt`) and a point on the globe where the camera goes (`focus`). The timeline (`src/ui/timeline.js`) shows the chapters on top and, below, only the current chapter on its own scale, one dot per event. The left panel lists the chapter's events.
- **Pieces** (`src/world/pieces.js`, data in `src/data/pieces.js`): each event gets a miniature on a base in the color of its kind; monuments, world landmarks (Statue of Liberty, the 1945 bombs, the 1962 missiles...) and ancient civilizations also become pieces. The states on each period map get a pawn in their color. Pieces appear in the year the thing happens and stay: the board keeps filling up.
- **Traffic on the globe** (`Traffic`): ships on the period's routes (steam after 1840), planes between big cities after 1919, satellites after 1957.

## Step-by-step guides

- `src/data/guides.js` (`GUIDES`): for some events, a list of steps `{ y, p: [lon, lat], zoom, t, txt, ev? }`. `zoom` is `world`, `continent`, `region` or `close`; `ev` links the step to another event (it pulses on the map and, if it has an animation, the animation plays).
- `src/ui/guide.js`: the guide panel (numbered steps, previous/next, an automatic mode of 11 s per step) and the numbered markers on the map, joined by a dashed line. It opens from the "Step-by-step guide" button on an event card or from the "Step-by-step guides" list in the left panel. `←`/`→` move through the steps and `Esc` closes it.

## Clickable places, search and back

- Clicking (without dragging) a label or a board piece opens the place card (`src/ui/place.js`): monument, landmark, state, city or people. The card shows a short text, the linked events and what happened nearby. The pick is done in screen space (`Labels.pick`, `Pieces.pick`), so it works the same on the globe and on the bent map.
- The texts live in `src/data/places/*.js`, gathered by `src/data/places.js`. The keys are `lm:`, `wp:`, `civ:`, `st:`, `city:` and `reg:`.
- **Search** (`src/ui/search.js`): the ⌕ button, `/` or Ctrl+K. It finds events, guides, chapters, monuments, landmarks, states, cities, peoples and years ("1822", "500 BC"). When you choose a place, the map goes to a year in which it exists.
- The URL keeps what is open (`#cabral`, `#place=city:Lisbon`, `#year=1500`), and the browser's back and forward buttons work.

## Globe and map: a single switch

The globe dives into the map and the map rises into the globe at the same zoom: `DIVE_PPU` (6.5 px per square) in `globe.js` and `GLOBE_BELOW` (5.5) in `camera.js`. Near the switch, the globe tilts to the map view's tilt. The switch is a 0.55 s cross-fade: the last image of the outgoing view fades out over the new one. Pieces have a maximum size, about 1.7° on the globe and 3.5 squares on the map. From very far away, only the main pieces and the pawns remain.

## Sharp globe

The globe uses a 4096 × 2048 color texture and, separately, a smoothed 720 × 360 land field. The shader cuts that field at 0.4 to draw the coast, so the coastline stays smooth at any distance. Shallow water is computed in the shader, and a fine grain appears only up close.

## Round Earth, armies and sizes

- **Round map** (`src/world/bend.js`): in the top-down, tilted and isometric views, the flat world is bent over a sphere around the center of the view (in the shader of every map material). Near the center nothing changes; far away, the ground drops behind the horizon, and zooming out turns the map into a globe. Clicks and labels use the same bend.
- **Toy armies**: each state on the period map has up to 4 armies (little figures in its color) marching inside its territory; the great powers outside the Atlantic world (`WORLD_CIVS`) get a pawn and two armies; each war has two armies advancing on each other while it lasts.
- **Sizes**: monuments and pieces have a fixed size on screen (about 40 px) from afar and only reach map size up close; the main monuments are larger.
