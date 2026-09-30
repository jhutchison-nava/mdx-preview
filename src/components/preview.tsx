/* eslint-disable react-dom/no-unsafe-iframe-sandbox */
/* eslint-disable antfu/no-import-node-modules-by-path */
/* eslint-disable antfu/no-import-dist */
import * as React from 'react'

import { Route } from 'src/routes/index'
import { compileMdx } from 'src/utils/compile-mdx'

import uswdsCss from '../styles/uswds/preview.scss?url'

import uswdsJsInit from '../../node_modules/@uswds/uswds/dist/js/uswds-init.js?url'
import uswdsJs from '../../node_modules/@uswds/uswds/dist/js/uswds.js?url'
import uswdsHeader from '../components/uswds/header.html?raw'
import uswdsSideNav from '../components/uswds/side-navigation.html?raw'

export default function Preview({ content }: { content: string }) {
  const {
    show_navbar: showNavbar,
    show_sidebar: showSideNav,
    show_toc: showToc,
  } = Route.useSearch()

  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)

  const sendHTML = React.useCallback(async () => {
    const { html, toc } = await compileMdx(content)

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        html,
        toc,
        showNavbar: Boolean(showNavbar),
        showSideNav: Boolean(showSideNav),
        showToc: Boolean(showToc),
      }, '*')
    }
  }, [content, showNavbar, showSideNav, showToc])

  React.useEffect(() => {
    sendHTML()
  }, [sendHTML])

  const initialState = React.useMemo(() => {
    return {
      showNavbar: Boolean(showNavbar),
      showSideNav: Boolean(showSideNav),
      showToc: Boolean(showToc),
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <iframe
      ref={iframeRef}
      // The first message can fire before the iframe's listener exists
      onLoad={sendHTML}
      sandbox="allow-scripts allow-same-origin"
      // Lets code block copy buttons use the clipboard
      allow="clipboard-write"
      srcDoc={`<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>MDX Preview</title>
              <script src="${uswdsJsInit}"></script>
              <link rel="stylesheet" href="${uswdsCss}" />
              <script>
                  window.addEventListener('message', (e) => {
                      if (typeof e.data.html !== 'undefined') {
                        const content = document.getElementById('content')
                        if (content) {
                          content.innerHTML = e.data.html
                          runScripts(content)
                        }
                      }
                      if (typeof e.data.toc !== 'undefined') {
                        const tocColumn = document.getElementById('toc-column')
                        if (tocColumn) {
                          tocColumn.innerHTML = e.data.toc
                          initToc()
                        }
                      }
                      if (typeof e.data.showNavbar !== 'undefined') {
                          const navbar = document.getElementById('navbar')
                          if (navbar) {
                              navbar.style.display = e.data.showNavbar ? 'block' : 'none'
                          }
                      }
                      // Clearing the inline style lets the layout's responsive display classes apply
                      if (typeof e.data.showSideNav !== 'undefined') {
                          const sidenav = document.getElementById('sidenav')
                          if (sidenav) {
                              sidenav.style.display = e.data.showSideNav ? '' : 'none'
                          }
                      }
                      if (typeof e.data.showToc !== 'undefined') {
                          const tocColumn = document.getElementById('toc-column')
                          if (tocColumn) {
                              tocColumn.style.display = e.data.showToc ? '' : 'none'
                          }
                      }
                  })
                  // A srcdoc iframe resolves "#id" against the parent page's URL, so following a
                  // same-page link would load the editor inside the preview. Scroll to the target instead.
                  function scrollToHash(hash) {
                    const target = document.getElementById(decodeURIComponent(hash.slice(1)))
                    if (target) {
                      target.scrollIntoView()
                    }
                  }
                  document.addEventListener('click', (e) => {
                    const link = e.target.closest?.('a[href^="#"]')
                    if (link) {
                      e.preventDefault()
                      scrollToHash(link.getAttribute('href'))
                    }
                  })

                  // Port of bluebutton-site-static/src/utils/toc.ts, re-run whenever the TOC is replaced
                  let didScroll = false
                  window.addEventListener('scroll', () => (didScroll = true), { once: true })
                  let headingsObserver
                  function initToc() {
                    headingsObserver?.disconnect()
                    const visibleHeadingIds = new Set()
                    const tocLinks = document.querySelectorAll('#toc a')
                    const headings = document.querySelectorAll('main :is(h2,h3,h4,h5,h6)[id]')

                    let didClick = false
                    let activeId

                    headingsObserver = new IntersectionObserver(
                      (entries) => {
                        entries.forEach((entry) => {
                          if (entry.isIntersecting) {
                            visibleHeadingIds.add(entry.target.id)
                          }
                          else {
                            visibleHeadingIds.delete(entry.target.id)
                          }
                        })

                        if (!didClick) {
                          // As a user scrolls, get the latest id to enter the viewport
                          // When the page first loads, get the first/top-most id in the viewport
                          activeId = didScroll ? [...visibleHeadingIds].pop() : [...visibleHeadingIds][0]
                        }

                        if (visibleHeadingIds.size > 0) {
                          tocLinks.forEach(el => el.classList.toggle('usa-current', el.getAttribute('href') === '#' + activeId))
                        }

                        didClick = false
                      },
                      {
                        rootMargin: '-100px 0px',
                        threshold: 1,
                      },
                    )

                    const tocHeadingIds = Array.from(tocLinks)
                      .map(link => link.getAttribute('href')?.replace('#', ''))
                      .filter(Boolean)

                    Array.from(headings)
                      .filter(heading => tocHeadingIds.includes(heading.id))
                      .forEach(heading => headingsObserver.observe(heading))

                    tocLinks.forEach((el) => {
                      el.addEventListener('click', (e) => {
                        didClick = true
                        const href = el.getAttribute('href') || '#'
                        activeId = href?.replace('#', '') || undefined
                        // Prevent USWDS event from firing
                        e.stopImmediatePropagation()
                        // The site restores native behavior with \`document.location.href = href\`, but in
                        // this srcdoc iframe that would navigate to the editor's URL, so scroll instead
                        e.preventDefault()
                        scrollToHash(href)
                      })
                    })
                  }

                  // Scripts inserted with innerHTML don't run. Expressive Code's scripts
                  // watch the DOM for new code blocks, so each only needs to run once.
                  const ranScripts = new Set()
                  function runScripts(root) {
                    root.querySelectorAll('script').forEach((inert) => {
                      if (!ranScripts.has(inert.textContent)) {
                        ranScripts.add(inert.textContent)
                        const script = document.createElement('script')
                        script.type = inert.type
                        script.textContent = inert.textContent
                        document.head.appendChild(script)
                      }
                      inert.remove()
                    })
                  }
              </script>
          </head>
          <body>
            <div id="navbar" class="border-bottom border-base-lighter" style="display: ${initialState.showNavbar ? 'block' : 'none'};">${uswdsHeader}</div>
            <!-- Same structure as bluebutton-site-static/src/layouts/docs-layout.astro and side-nav.astro -->
            <div class="grid-container">
              <div class="grid-row">
                <div
                  id="sidenav"
                  class="display-none position-sticky tablet:display-block tablet:grid-col-auto overflow-y-auto overflow-x-hidden padding-top-5 desktop:padding-top-7 padding-right-05 padding-bottom-6 padding-left-05 margin-left-neg-05"
                  style="top: 4rem; max-height: calc(100vh - 4.5rem);${initialState.showSideNav ? '' : ' display: none;'}"
                >
                  <div class="width-card-lg">${uswdsSideNav}</div>
                </div>
                <main id="main-content" class="grid-col-fill">
                  <div class="grid-row">
                    <div
                      id="toc-column"
                      class="grid-col-auto order-last margin-left-auto width-full maxw-card-lg display-none desktop-lg:display-block"
                      style="${initialState.showToc ? '' : 'display: none;'}"
                    ></div>
                    <div id="page-content" class="grid-col-fill">
                      <div class="desktop:padding-left-2 padding-y-6">
                        <div id="content"></div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
            </body>
            <script src="${uswdsJs}"></script>
          </html>`}
      title="MDX Preview"
      className="w-full h-full border-none"
    />
  )
}
