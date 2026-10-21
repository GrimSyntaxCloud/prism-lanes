# Prism Lanes design previews

Two alternative homepage studies live in `rainbow-bowling-static/static-site/previews/`. After Dark was selected for the live homepage. Both original studies remain in source for reference; the build excludes the `previews/` directory from publication. Shared assets now live in `static-site/assets/`.

- **After Dark:** a cinematic neon lane rendered with Three.js, a roll-to-strike interaction, animated typography strip, cosmic event poster, food illustration, and expandable league descriptions.
- **Sunday Social:** warm paper texture, vintage club typography, original bowling and pizza illustrations, a score-ticket price panel, cosmic-night section, and expandable leagues.

Both include a keyboard-accessible native dialog with a sample price calculator. It collects no personal details, stores nothing, and makes no bookings or payments. Standard bowling estimates include one game and shoes per player. Fictional prices and original league concepts are retained; the proposed food section is explicitly illustrative.

## Run locally

```sh
python3 -m http.server 4322 --bind 127.0.0.1 --directory rainbow-bowling-static/static-site
```

Compare at `http://127.0.0.1:4322/previews/index.html`. All resources use relative paths and work under the existing free GitHub Pages repository path. No API keys, database, paid service, or package installation is required.

## Assets and accessibility

Illustrations and the 3D scene are original code-created assets. Font files are self-hosted under the SIL Open Font License. Three.js is bundled under MIT. Licenses and credits live alongside the assets. No external runtime requests or tracking are used.

The 3D scene renders only while visible and motion can be paused. Reduced-motion preferences disable ambient animations; the bowling interaction provides a still result. Non-WebGL browsers receive a graphic fallback and can still use all venue sections and the planner. Navigation, summaries, and dialogs support keyboard access.

## Review checks

- Existing static build/link validation passes.
- Browser checks cover both visual directions, the planner calculation, league expansion, and bowling feedback.
- Mobile layouts checked in 320px and 390px frames, including narrow-screen overflow.
- This is a design prototype. The chosen After Dark direction is published as the root homepage; Sunday Social stays a source-only alternative.
