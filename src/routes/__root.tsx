import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import * as React from 'react'
import { DefaultCatchBoundary } from 'src/components/DefaultCatchBoundary'
import { NotFound } from 'src/components/NotFound'

import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    links: [
      { rel: 'icon', href: `${import.meta.env.BASE_URL}favicon.ico` },
      { rel: 'manifest', href: `${import.meta.env.BASE_URL}site.webmanifest` },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>MDX Editor</title>
        <HeadContent />
      </head>
      <body>
        {children}
        {/* <TanStackRouterDevtools position="bottom-right" /> */}
        <Scripts />
      </body>
    </html>
  )
}
