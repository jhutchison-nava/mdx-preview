import { toString } from 'hast-util-to-string'

// Collects headings the way Astro's heading-ids plugin does for `render()`'s `headings`:
// every markdown h1–h6 with its depth, id and text. Runs after rehype-slug assigns the ids.

export type MarkdownHeading = {
  depth: number
  slug: string
  text: string
}

type HastNode = {
  type: string
  tagName?: string
  properties?: { id?: unknown }
  children?: HastNode[]
}

export function rehypeCollectHeadings() {
  return (tree: HastNode, file: { data: Record<string, unknown> }) => {
    const headings: MarkdownHeading[] = []
    const visit = (node: HastNode) => {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName ?? '') && typeof node.properties?.id === 'string') {
        headings.push({
          depth: Number(node.tagName![1]),
          slug: node.properties.id,
          text: toString(node as any),
        })
      }
      node.children?.forEach(visit)
    }
    visit(tree)
    file.data.headings = headings
  }
}
