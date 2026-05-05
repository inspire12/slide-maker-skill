---
name: slides-deploy
description: Publish approved slide HTML to the GitHub Pages lecture archive using the repository GitHub Actions workflow.
---

# Slides Deploy

Use this reference after the user approves the final reviewed deck.

## Current Deployment Contract

This repository publishes `_site/` to GitHub Pages through `.github/workflows/deploy-pages.yml`.

The workflow:

- builds the site with `bash scripts/build-pages.sh`
- uploads `_site/` as a Pages artifact
- deploys it with `actions/deploy-pages`
- runs automatically on pushes to `main` that change `slides/**/*.html`, `slides/images/**`, `scripts/build-pages.sh`, or the workflow file
- can also run through `workflow_dispatch`

## Pre-Deploy Checklist

1. The source `.md` and generated `.html` are in sync.
2. Feedback memo items are resolved or explicitly left as open review items.
3. `bash scripts/build-pages.sh` succeeds locally.
4. The lecture appears in `_site/` and index metadata is current.
5. Commit the source, generated HTML, images, feedback memo, and template changes that are part of the release.

## Publish Flow

Preferred flow:

1. Commit approved changes on the working branch.
2. Merge or fast-forward into `main`, or open the repository's normal PR flow.
3. Push `main` so GitHub Actions deploys to GitHub Pages.
4. Confirm the Pages workflow succeeded and share the GitHub Pages URL.

If the user asks to deploy from the current branch, explain whether the workflow will run from that branch. In the current repository, automatic deploy is tied to `main`, not `develop`.

## Output

Report:

- commit hash deployed or ready to deploy
- whether the GitHub Actions workflow was triggered automatically or needs manual dispatch/merge to `main`
- expected GitHub Pages location
- any open feedback or source/HTML drift risk
