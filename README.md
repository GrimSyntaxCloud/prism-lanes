# Prism Lanes

Formerly Rainbow Bowling. A coursework concept for a fictional bowling venue, originally credited to Andres M. and Dan S. The repository preserves its WordPress theme experiments in `rainbow-bowling/` and `rainbow-bowling-static/`.

The public demo is `rainbow-bowling-static/static-site/`. The former scaffold had an unfinished homepage and four empty files. The refreshed version provides five responsive static pages using the original bowling, league, pricing, and location content. The food page explicitly identifies the missing original menu rather than inventing a real service. All business details and prices are fictional.

No WordPress, PHP host, database, contact submission, booking, payments, or third-party scripts are used by this static demo. The WordPress sources are not uploaded to GitHub Pages.

## Preview and validate

Use Python 3 (no package installation):

```sh
python3 scripts/build.py
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. The build packages only static public assets and checks local page links, fragments, images, scripts, and CSS resources. Relative paths work beneath a GitHub Pages repository URL.

## GitHub Pages

Pull requests and pushes to `master` run validation. Publishing is available manually and on pushes to `master`:

1. In repository **Settings → Pages**, select **GitHub Actions** as the source.
2. In **Actions → Publish GitHub Pages**, run the workflow on `master`.
3. Use the deployment URL returned by GitHub after it succeeds; then update the repository homepage and portfolio.

This public repository can use free GitHub Pages. No Azure subscription, database allocation, or payment method is needed. Changes to `master` publish after validation. Live demo: https://grimsyntaxcloud.github.io/prism-lanes/
