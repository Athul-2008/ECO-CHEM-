# EcoChem — Smart Sorting Assistant

A responsive, static website inspired by the EcoChem waste-sorting assistant shown in the supplied video reference. It uses plain HTML, CSS, and browser JavaScript: there are no package installs, API keys, database, account, or build framework.

## Files

- `index.html` — page structure, accessible navigation, search, sorting guide, and footer.
- `styles.css` — the responsive design system, globe illustration, cards, and upload layout.
- `app.js` — local sample sorting catalogue, conservative fallback guidance, search interactions, and image preview.
- `ecochem-logo.svg` and `favicon.svg` — the brand mark and browser icon.
- `manus-routes.json` — the single-page route manifest used by Manus hosting.
- `app.config.ts` — Manus project logo metadata; it is not needed for GitHub Pages.

## Run locally

With Python 3 installed, open a terminal in this folder and run:

```sh
python3 -m http.server 3000
```

Then open `http://localhost:3000`. On Windows, `py -m http.server 3000` is also available in a Python installation.

## Publish with GitHub Pages

1. Create a new public GitHub repository, for example `ecochem-smart-sorting`.
2. Upload the files and folders in this project to the repository's **root** (not inside an extra nested folder), then commit to the `main` branch.
3. Open **Settings → Pages** in the repository.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, and save.
5. Wait for GitHub Pages to finish publishing. Its Pages panel will show the public site URL.

The HTML uses relative asset paths, so it also works when GitHub Pages hosts the site under a repository subpath. No GitHub Actions workflow is required.

## Other static hosts

This site can be uploaded as-is to any static host. It does not require a server-side runtime. Preserve the source files in the same relative layout when uploading.

## About the sorting prototype

The six showcased examples have curated, item-specific sorting notes. Other typed items use cautious keyword-based guidance, not a remote model. Photo upload previews the selected image locally; the demo only uses the photo filename to offer a sample sorting result. The photo is not uploaded, there is no AI vision analysis, and local collection rules may differ. Visitors should follow their community's waste instructions, especially for batteries and unknown chemicals.
