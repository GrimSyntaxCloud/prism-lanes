# Prism Lanes

[Live demo](https://grimsyntaxcloud.github.io/prism-lanes/)

A fictional bowling venue with an After Dark visual identity: neon colors, bold typography, and an interactive 3D bowling lane. Originally Rainbow Bowling, a coursework concept credited to Andres M. and Dan S. The original WordPress experiments remain in `rainbow-bowling/` and `rainbow-bowling-static/`.

## What visitors can do

- Roll a strike in the browser-rendered bowling scene.
- Explore cosmic bowling, illustrative prices, a proposed food concept, and the original league ideas.
- Expand league descriptions and try the sample visit planner. Estimates include shoes and one game per player for standard bowling.
- Pause motion; operating-system reduced-motion preferences are respected.

This is a portfolio demo, not a real business. All venue details and prices are fictional. It takes no reservations, registrations, payments, or personal information. The food illustration is a design concept, not an established menu.

## How it works

The public homepage is `rainbow-bowling-static/static-site/index.html`. HTML and CSS provide the layout; vanilla JavaScript powers the accessible planner dialog and motion toggle. A locally bundled MIT-licensed Three.js module renders the bowling scene, with a graphic fallback when WebGL is unavailable. The scene stops its rendering loop when offscreen or paused.

The fonts are locally hosted under the SIL Open Font License. Artwork is original SVG and procedural 3D. Asset licenses and credits are included in `static-site/assets/`. No external scripts, analytics, paid assets, accounts, API keys, backend, or database are required.

The original `leagues.html`, `events.html`, `food.html`, and `contact-us.html` URLs forward to their corresponding homepage sections. The two design explorations remain in source under `previews/` and are excluded from the public build; see [design notes](DESIGN-PREVIEWS.md).

## Preview and validate

Use Python 3 (no package installation):

```sh
python3 scripts/build.py
python3 -m http.server 8080 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:8080. The build packages only the public static site and checks local HTML/CSS links and resources. Relative asset paths support the GitHub Pages repository URL.

## Free deployment

GitHub Actions validates pull requests. Merging to `master` validates and deploys to the existing GitHub Pages site automatically; manual deployment is also available. The repository is public and uses free GitHub Pages. No Azure resources, database capacity, subscription changes, or payment service are involved.
