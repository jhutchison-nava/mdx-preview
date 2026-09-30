import type { MarkdownHeading } from 'src/utils/rehype-collect-headings'

// Port of bluebutton-site-static/src/components/toc.astro. The scroll spy from
// src/utils/toc.ts runs inside the preview iframe (see preview.tsx).
export function TableOfContents({ headings = [] }: { headings: MarkdownHeading[] }) {
  // Only show headings up to h3 in sidebar
  const filteredHeadings = headings.filter(h => h.depth < 4)

  return (
    <aside
      id="toc"
      className="margin-top-0 overflow-y-auto padding-y-6 position-sticky margin-left-4"
      style={{ top: '5.75rem', maxHeight: 'calc(100vh - 6rem)' }}
    >
      <nav className="padding-1" aria-labelledby="toc-heading">
        <h3 className="margin-bottom-2 font-sans-2xs" id="toc-heading">On this page</h3>
        <ul className="usa-in-page-nav__list">
          {filteredHeadings.map(heading => (
            <li
              key={heading.slug}
              className={['usa-in-page-nav__item', heading.depth < 3 ? 'usa-in-page-nav__item--primary' : ''].filter(Boolean).join(' ')}
            >
              <a
                href={`#${heading.slug}`}
                className="usa-in-page-nav__link"
                style={
                  heading.depth >= 3
                    ? {
                        // We use inline styles here because the USWDS sidebar link styles have a higher specificity than the utility classes
                        paddingLeft: '1.5rem',
                      }
                    : undefined
                }
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
