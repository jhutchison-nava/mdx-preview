import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { EditorView, basicSetup } from 'codemirror'
import { useEffect, useImperativeHandle, useRef } from 'react'

export type SimpleEditorHandle = {
  goToLine: (line: number, column?: number) => void
}

export default function SimpleEditor({
  defaultValue,
  onChange,
  ref,
}: {
  defaultValue: string
  onChange: (value: string) => void
  ref?: React.Ref<SimpleEditorHandle>
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useImperativeHandle(ref, () => ({
    goToLine(line, column = 1) {
      const view = viewRef.current
      if (!view) return
      const { doc } = view.state
      const target = doc.line(Math.min(Math.max(line, 1), doc.lines))
      const pos = Math.min(target.from + column - 1, target.to)
      view.dispatch({
        selection: { anchor: pos },
        effects: EditorView.scrollIntoView(pos, { y: 'center' }),
      })
      view.focus()
    },
  }), [])

  useEffect(() => {
    if (!editorRef.current) return

    const view = new EditorView({
      doc: defaultValue,
      extensions: [
        basicSetup,
        markdown({ base: markdownLanguage }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString())
          }
        }),
        EditorView.theme({
          '&': { height: '100%', fontSize: '14px' },
          '.cm-scroller': { overflow: 'auto', fontFamily: '"Fira Code", "Fira Mono", ui-monospace, monospace' },
          '.cm-content': { lineHeight: '1.6' },
          '.cm-gutters': { backgroundColor: 'transparent', borderRight: 'none' },
        }),
      ],
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={editorRef} className="size-full overflow-auto" />
}
