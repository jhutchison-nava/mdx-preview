import { compile, run } from '@mdx-js/mdx'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import * as runtime from 'react/jsx-runtime'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import { AccordionItem, AccordionList } from 'src/components/mdx-components/accordion'
import { Alert } from 'src/components/mdx-components/alert'
import { IconList } from 'src/components/mdx-components/icon-list'
import { Image } from 'src/components/mdx-components/image'
import { Link } from 'src/components/mdx-components/link'
import { OverflowTable } from 'src/components/mdx-components/overflow-table'
import { ProcessList, ProcessListItem } from 'src/components/mdx-components/process-list'
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
  const code = await compile(markdown, {
    outputFormat: 'function-body',
    format: 'mdx',
    // Frontmatter is parsed so it's hidden from the output, like Astro does
    remarkPlugins: [remarkFrontmatter, remarkStubImports, remarkGfm, remarkSmartypants],
  })

  const result = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  })

  return renderToString(createElement(result.default, { components }))
}
