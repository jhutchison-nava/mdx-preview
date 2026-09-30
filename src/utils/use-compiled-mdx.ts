import * as React from 'react'

import type { CompileError } from 'src/utils/compile-error'
import { toCompileError } from 'src/utils/compile-error'
import { compileMdx } from 'src/utils/compile-mdx'

type CompiledMdx = Awaited<ReturnType<typeof compileMdx>>

// Errors wait until typing pauses, so half-typed tags don't flash an error
const ERROR_DELAY_MS = 800

// Compiles the markdown as it changes. `result` keeps the last successful
// compile, so the preview stays put while there's an error.
export function useCompiledMdx(markdown: string) {
  const [result, setResult] = React.useState<CompiledMdx | null>(null)
  const [error, setError] = React.useState<CompileError | null>(null)
  const latestRequest = React.useRef(0)

  React.useEffect(() => {
    const request = ++latestRequest.current
    let errorTimeout: number | undefined

    compileMdx(markdown).then(
      (compiled) => {
        // A slower, older compile must not overwrite a newer one
        if (request !== latestRequest.current) return
        setResult(compiled)
        setError(null)
      },
      (err) => {
        if (request !== latestRequest.current) return
        errorTimeout = window.setTimeout(() => setError(toCompileError(err, markdown)), ERROR_DELAY_MS)
      },
    )

    return () => window.clearTimeout(errorTimeout)
  }, [markdown])

  return { result, error }
}
