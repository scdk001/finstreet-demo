# FINSTREET AI Loan Concierge

An interactive, fictional AI-assisted loan intake prototype designed as the public entry point to the FINSTREET AI Lending Platform.

## Local development

```bash
pnpm install
pnpm dev
```

Open `http://127.0.0.1:4180/finstreet-demo/`.

## Build

```bash
pnpm lint
pnpm build
pnpm preview
```

The Vite base is `/finstreet-demo/` for the GitHub Pages project path. `public/404.html` returns unknown GitHub Pages routes to that base.

## GitHub Pages deployment

Pushes to `main` run `.github/workflows/deploy-pages.yml`, which validates the source, builds `dist`, and deploys the artifact with GitHub Pages. Configure the repository Pages source as **GitHub Actions**.

## Demo handoff

The concierge creates fictional application `FSA-2026-00127` and links only that identifier to the Broker review route. No applicant data is placed in the URL and no cross-domain `localStorage` sharing is assumed.

See [INTEGRATION.md](./INTEGRATION.md) for the production shared-service design.

## Boundaries

- The AI, document extraction and submission services are simulated adapters.
- Uploaded files remain browser-only and are not sent to a server.
- All information is fictional and must be reviewed by a broker.
- The prototype does not provide eligibility, pricing, approval or a credit decision.
