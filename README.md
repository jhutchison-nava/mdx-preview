# mdx-preview

A live MDX preview editor built with TanStack Start in [SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode), deployed as static files to **GitHub Pages**.

## Stack

- [TanStack Start](https://tanstack.com/start) (SPA mode) + React 19, bundled by Vite
- CodeMirror editor
- The preview uses the Blue Button site's USWDS theme and [Expressive Code](https://expressive-code.com) code blocks
- No backend: MDX is compiled and rendered in the browser

## MDX components

The preview supports the components the [Blue Button site](https://github.com/CMSgov/bluebutton-site-static) passes to its MDX, with the same props: `Alert`, `ProcessList`, `ProcessListItem`, `AccordionList`, `AccordionItem`, `IconList`, `Link` and `Image`. Markdown links render with `Link`, and tables with `OverflowTable`. Frontmatter is hidden, except that its `title` renders as the page's `<h1>` like the site's page templates, and headings get the same `id`s as on the site (via `rehype-slug`). Imports (such as images from `#assets/...`) can't be resolved, so they become `undefined` and `Image` shows a placeholder.

## Saving

The editor's content is saved to the browser's `localStorage` on every change, so it survives reloads. It is only stored on that browser and device. **Reset** (with a confirmation prompt) clears the saved copy and restores the default example content. To share a document, copy the markdown.

## Page layout and table of contents

The preview uses the same layout as the site's `DocsLayout`. **Show Navbar**, **Show Sidebar** and **Show TOC** in the settings menu toggle the sample header, the sample side navigation and the table of contents.

The TOC is built from the content's headings (`src/utils/rehype-collect-headings.ts`, like Astro's `headings`) and rendered by a port of the site's `toc.astro`, including its scroll spy. Like the site, it only appears at the `desktop-lg` breakpoint (1200px) and wider, so hide the editor or widen the window to see it.

## Styles and code blocks

The preview iframe loads `src/styles/uswds/preview.scss`, which compiles USWDS with the Blue Button theme. `_uswds-theme.scss` and `_uswds-theme-custom-styles.scss` are copied from `bluebutton-site-static/src/assets/sass`; the only change is `$theme-font-path`, so Vite can resolve the USWDS fonts. When the site's theme changes, copy the files again.

Code blocks use `rehype-expressive-code` with the same options as the site's `astro.config.mjs` (see `src/utils/expressive-code.ts`), including the FHIRPath grammar in `src/grammars`.

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
