# mdx-preview

A live MDX preview editor built with TanStack Start in [SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode), deployed as static files to **GitHub Pages**.

## Stack

- [TanStack Start](https://tanstack.com/start) (SPA mode) + React 19, bundled by Vite
- CodeMirror editor, USWDS styles
- No backend: MDX is compiled and rendered in the browser

## Saving

The editor's content is saved to the browser's `localStorage` on every change, so it survives reloads. It is only stored on that browser and device. **Reset** (with a confirmation prompt) clears the saved copy and restores the default example content. To share a document, copy the markdown.

## Development

```sh
pnpm install
pnpm dev
```

## Building

```sh
pnpm build                          # static site in ./dist/client
BASE_PATH=/mdx-preview/ pnpm build  # build for a GitHub Pages project site
pnpm preview
pnpm typecheck
```

`pnpm build` prerenders a SPA shell to `dist/client/index.html` and copies it to `404.html`, so GitHub Pages falls back to the app for unknown paths.

## Deploying

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`. It sets `BASE_PATH` from the Pages configuration, so it works for both `/<repo>/` project sites and custom domains.

One-time setup: in the repo, go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
