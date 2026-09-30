import { compile, run } from '@mdx-js/mdx'
import { createElement, Fragment } from 'react'
import { renderToString } from 'react-dom/server'
import * as runtime from 'react/jsx-runtime'
import rehypeExpressiveCode from 'rehype-expressive-code'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkSmartypants from 'remark-smartypants'
import { AccordionItem, AccordionList } from 'src/components/mdx-components/accordion'
import { Alert } from 'src/components/mdx-components/alert'
import { IconList } from 'src/components/mdx-components/icon-list'
import { Image } from 'src/components/mdx-components/image'
import { Link } from 'src/components/mdx-components/link'
import { OverflowTable } from 'src/components/mdx-components/overflow-table'
import { ProcessList, ProcessListItem } from 'src/components/mdx-components/process-list'
import { TableOfContents } from 'src/components/table-of-contents'
import { expressiveCodeOptions } from 'src/utils/expressive-code'
import type { MarkdownHeading } from 'src/utils/rehype-collect-headings'
import { rehypeCollectHeadings } from 'src/utils/rehype-collect-headings'
import { remarkStubImports } from 'src/utils/remark-stub-imports'

// Mirrors the components the Blue Button site passes to its MDX content
const components = {
  a: Link,
  table: OverflowTable,
  AccordionItem,
  AccordionList,
  Alert,
  IconList,
  Image,
  Link,
  ProcessList,
  ProcessListItem,
}

export async function compileMdx(markdown: string) {
  // The .mdx path makes Expressive Code emit its <style>/<script> as JSX that React renders as-is
  const code = await compile({ value: markdown, path: 'preview.mdx' }, {
    outputFormat: 'function-body',
    format: 'mdx',
    // Frontmatter is hidden from the output, like Astro does, and exported for the page title
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkStubImports, remarkGfm, remarkSmartypants],
    // Heading ids match Astro's, which also slugs heading text with github-slugger
    rehypePlugins: [rehypeSlug, rehypeCollectHeadings, [rehypeExpressiveCode, expressiveCodeOptions]],
  })

  const result = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  })

  const title = (result.frontmatter as { title?: unknown } | undefined)?.title

  // Same structure as the Blue Button page templates: the frontmatter title as the
  // page's h1, followed by the content in a .usa-prose wrapper
  const html = renderToString(createElement(Fragment, null,
    title
      ? createElement('div', { className: 'margin-bottom-4' }, createElement('h1', null, String(title)))
      : null,
    createElement('div', { className: 'usa-prose' }, createElement(result.default, { components })),
  ))

  // Like DocsLayout, drop the "Footnotes" heading added by remark-gfm, and only
  // render the TOC when there are headings left
  const headings = ((code.data.headings ?? []) as MarkdownHeading[]).filter(h => h.slug !== 'footnote-label')
  const toc = headings.length > 0 ? renderToString(createElement(TableOfContents, { headings })) : ''

  return { html, toc }
}
