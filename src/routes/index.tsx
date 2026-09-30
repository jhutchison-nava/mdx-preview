import { Menu } from '@ark-ui/react/menu'
import { Splitter, useSplitter } from '@ark-ui/react/splitter'
import { createFileRoute, Link, stripSearchParams, useNavigate } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { cx } from 'cva.config'
import * as React from 'react'
import initialContent from 'src/utils/initial-content'
import { z } from 'zod'

import { NotFound } from 'src/components/NotFound'
import Preview from 'src/components/preview'
import type { SimpleEditorHandle } from 'src/components/simple-editor'
import { clearContent, loadContent, saveContent } from 'src/utils/storage'
import { useCompiledMdx } from 'src/utils/use-compiled-mdx'

const searchSchema = z.object({
  show_navbar: z.boolean().default(false).optional(),
  show_sidebar: z.boolean().default(false).optional(),
  show_toc: z.boolean().default(false).optional(),
})

type SearchParams = z.infer<typeof searchSchema>

const SimpleEditor = React.lazy(() => import('src/components/simple-editor').then(mod => ({
  default: mod.default,
})))

export const Route = createFileRoute('/')({
  component: NewPreview,
  notFoundComponent: () => <NotFound />,
  validateSearch: zodValidator(searchSchema),
  shouldReload: false,
  search: {
    middlewares: [
      // Removes when false
      stripSearchParams({
        show_navbar: false,
        show_sidebar: false,
        show_toc: false,
      }),
    ],
  },
})

function NewPreview() {
  const {
    show_navbar: showNavbar,
    show_sidebar: showSidebar,
    show_toc: showToc,
  } = Route.useSearch()

  const navigate = useNavigate({
    from: '/',
  })
  const [markdown, setMarkdown] = React.useState(() => loadContent() ?? initialContent)
  // The editor only reads its initial value, so remount it to load new content
  const [editorKey, setEditorKey] = React.useState(0)
  const editorRef = React.useRef<SimpleEditorHandle>(null)
  const { result, error } = useCompiledMdx(markdown)

  const handleChange = (value: string) => {
    setMarkdown(value)
    saveContent(value)
  }

  const handleReset = () => {
    if (!window.confirm('Replace your content with the default example? This can\'t be undone.')) {
      return
    }
    clearContent()
    setMarkdown(initialContent)
    setEditorKey(key => key + 1)
  }

  const handleUpdateSetting = (payload: SearchParams) => {
    navigate({
      to: '/',
      search: prev => ({
        ...prev,
        ...payload,
      }),
      replace: true,
      ignoreBlocker: true,
    })
  }

  const splitter = useSplitter({
    defaultSize: [50, 50],
    panels: [{
      id: 'a',
      collapsible: true,
      collapsedSize: 0,
    }, {
      id: 'b',
      minSize: 25,
    }],
  })

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            {/* <FileText className="h-6 w-6 text-indigo-600" /> */}
            <h1 className="text-xl font-semibold text-gray-900">
              <Link
                to="/"
                reloadDocument
              >
                MDX Editor
              </Link>
            </h1>
          </div>
          <div className="flex gap-2">
            <Menu.Root
              closeOnSelect={false}
              positioning={{
                placement: 'bottom',
              }}
            >
              <Menu.Trigger className="size-10 inline-flex items-center justify-center border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 cursor-pointer">
                <span aria-hidden className="icon-[material-symbols--settings] h-5 w-5 text-gray-600"></span>
                <span className="sr-only">Settings</span>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content className="z-10 w-48 bg-white rounded-md shadow-lg focus:outline-none p-1 ring-1 ring-gray-200">
                  <Menu.CheckboxItem
                    className="flex rounded-sm items-center gap-2 px-2 h-10 cursor-pointer bg-white text-gray-900 [[data-highlighted]]:bg-gray-100 group"
                    value="show_navbar"
                    checked={Boolean(showNavbar)}
                    onCheckedChange={(value) => {
                      handleUpdateSetting({ show_navbar: value })
                    }}
                  >
                    <div className="flex items-center justify-center size-4.5 border border-gray-400 rounded-sm bg-white group-[[data-state=checked]]:bg-blue-700 group-[[data-state=checked]]:border-blue-700">
                      <Menu.ItemIndicator className="flex items-center justify-center">
                        <svg viewBox="0 0 24 24" data-state="checked" className="stroke-white stroke-3 size-3.5 fill-none [stroke-linecap:round] [stroke-linejoin:round]">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </Menu.ItemIndicator>
                    </div>
                    <Menu.ItemText>Show Navbar</Menu.ItemText>
                  </Menu.CheckboxItem>
                  <Menu.CheckboxItem
                    className="flex rounded-sm items-center gap-2 px-2 h-10 cursor-pointer bg-white text-gray-900 [[data-highlighted]]:bg-gray-100 group"
                    value="show_sidebar"
                    checked={Boolean(showSidebar)}
                    onCheckedChange={(value) => {
                      handleUpdateSetting({ show_sidebar: value })
                    }}
                  >
                    <div className="flex items-center justify-center size-4.5 border border-gray-400 rounded-sm bg-white group-[[data-state=checked]]:bg-blue-700 group-[[data-state=checked]]:border-blue-700">
                      <Menu.ItemIndicator className="flex items-center justify-center">
                        <svg viewBox="0 0 24 24" data-state="checked" className="stroke-white stroke-3 size-3.5 fill-none [stroke-linecap:round] [stroke-linejoin:round]">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </Menu.ItemIndicator>
                    </div>
                    <Menu.ItemText>Show Sidebar</Menu.ItemText>
                  </Menu.CheckboxItem>

                  <Menu.CheckboxItem
                    className="flex rounded-sm items-center gap-2 px-2 h-10 cursor-pointer bg-white text-gray-900 [[data-highlighted]]:bg-gray-100 group"
                    value="show_toc"
                    checked={Boolean(showToc)}
                    onCheckedChange={(value) => {
                      handleUpdateSetting({ show_toc: value })
                    }}
                  >
                    <div className="flex items-center justify-center size-4.5 border border-gray-400 rounded-sm bg-white group-[[data-state=checked]]:bg-blue-700 group-[[data-state=checked]]:border-blue-700">
                      <Menu.ItemIndicator className="flex items-center justify-center">
                        <svg viewBox="0 0 24 24" data-state="checked" className="stroke-white stroke-3 size-3.5 fill-none [stroke-linecap:round] [stroke-linejoin:round]">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </Menu.ItemIndicator>
                    </div>
                    <Menu.ItemText>Show TOC</Menu.ItemText>
                  </Menu.CheckboxItem>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
            <button
              type="button"
              onClick={() => splitter.isPanelCollapsed('a') ? splitter.expandPanel('a') : splitter.collapsePanel('a')}
              className={cx('h-10 inline-flex items-center px-3 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 cursor-pointer')}
            >
              {splitter.isPanelCollapsed('a')
                ? (
                    <>
                      {/* <Eye className="h-4 w-4 mr-2" /> */}
                      Show Editor
                    </>
                  )
                : (
                    <>
                      {/* <Split className="h-4 w-4 mr-2" /> */}
                      Hide Editor
                    </>
                  )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={markdown === initialContent}
              className={cx('h-10 inline-flex items-center px-3 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed')}
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <Splitter.RootProvider value={splitter} asChild>
        <main className="h-full flex">
          <Splitter.Panel id="a">
            {/* Editor */}
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0">
                <React.Suspense fallback={(
                  <div className="h-full flex items-center justify-center">
                    <span className="icon-[material-symbols--progress-activity] animate-spin size-10 bg-gray-400"></span>
                  </div>
                )}
                >
                  <SimpleEditor
                    key={editorKey}
                    ref={editorRef}
                    defaultValue={markdown}
                    onChange={handleChange}
                  />
                </React.Suspense>
              </div>
              <div role="status" aria-live="polite">
                {error
                  ? (
                      <div className="border-t-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-start gap-3">
                          <span aria-hidden className="icon-[material-symbols--error] size-5 shrink-0 text-red-700"></span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-red-800">
                              {error.line
                                ? `Error on line ${error.line}${error.column ? `, column ${error.column}` : ''}`
                                : 'Error'}
                            </p>
                            <p className="mt-1 font-mono text-[13px] break-words">{error.message}</p>
                            <p className="mt-1 text-gray-600">The preview shows the last version without errors.</p>
                          </div>
                          {error.line
                            ? (
                                <button
                                  type="button"
                                  onClick={() => editorRef.current?.goToLine(error.line!, error.column)}
                                  className="h-8 shrink-0 inline-flex items-center px-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 cursor-pointer"
                                >
                                  Go to line
                                  {' '}
                                  {error.line}
                                </button>
                              )
                            : null}
                        </div>
                      </div>
                    )
                  : null}
              </div>
            </div>
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="a:b" aria-label="Resize" className="items-center group outline-none tablet:flex h-full w-1.5 bg-gray-300 hover:bg-blue-500 hover:outline-2 [[data-focus]]:bg-blue-500 transition-colors duration-300" />
          <Splitter.Panel id="b">
            {/* Preview */}
            <div className={cx('h-full')}>
              <div className="h-full bg-white relative">
                <Preview html={result?.html ?? ''} toc={result?.toc ?? ''} />
              </div>
            </div>
          </Splitter.Panel>
        </main>
      </Splitter.RootProvider>
    </div>
  )
}
