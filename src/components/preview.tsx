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
    // show_toc: showToc,
  } = Route.useSearch()

  const iframeRef = React.useRef<HTMLIFrameElement | null>(null)

  const sendHTML = React.useCallback(async () => {
    const markupString = await compileMdx(content)

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        html: markupString,
        showNavbar: Boolean(showNavbar),
        showSideNav: Boolean(showSideNav),
        // showToc: Boolean(showToc),
      }, '*')
    }
  }, [content, showNavbar, showSideNav])

  React.useEffect(() => {
    sendHTML()
  }, [sendHTML])

  const initialState = React.useMemo(() => {
    return {
      showNavbar: Boolean(showNavbar),
      showSideNav: Boolean(showSideNav),
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
                      if (typeof e.data.showNavbar !== 'undefined') {
                          const navbar = document.getElementById('navbar')
                          if (navbar) {
                              navbar.style.display = e.data.showNavbar ? 'block' : 'none'
                          }
                      }
                      if (typeof e.data.showSideNav !== 'undefined') {
                          const sidenav = document.getElementById('sidenav')
                          if (sidenav) {
                              sidenav.style.display = e.data.showSideNav ? 'block' : 'none'
                          }
                      }
                      if (typeof e.data.showToc !== 'undefined') {
                          const toc = document.getElementById('toc')
                          if (toc) {
                              toc.style.display = e.data.showToc ? 'block' : 'none'
                          }
                      }
                  })
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
            <main class="usa-section">
              <div class="grid-container">
                <div class="grid-row grid-gap">
                  <div id="sidenav" style="display: ${initialState.showSideNav ? 'block' : 'none'};" class="display-none desktop:display-block desktop:grid-col-3 order-last desktop:order-first">${uswdsSideNav}</div>
                  <div id="content" class="desktop:grid-col"></div>
                </div>
              </div>
            </main>
            </body>
            <script src="${uswdsJs}"></script>
          </html>`}
      title="MDX Preview"
      className="w-full h-full border-none"
    />
  )
}
