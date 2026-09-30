// Turns an MDX compile or render error into a message plus the line/column in the
// editor's source, so the editor can show where the problem is.

export type CompileError = {
  message: string
  line?: number
  column?: number
}

type ErrorLike = Error & {
  reason?: string
  line?: number | null
  column?: number | null
  linePos?: [{ line: number, col: number }, ...unknown[]]
}

// 1-based line/column of the first match outside fenced code blocks
function findInSource(source: string, pattern: RegExp) {
  let inFence = false
  const lines = source.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(?:```|~~~)/.test(lines[i])) {
      inFence = !inFence
      continue
    }
    const match = inFence ? null : pattern.exec(lines[i])
    if (match) {
      return { line: i + 1, column: match.index + 1 }
    }
  }
  return {}
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function locate(error: ErrorLike, message: string, source: string): Pick<CompileError, 'line' | 'column'> {
  // YAML errors count lines from the start of the frontmatter, after the opening ---
  if (error.name === 'YAMLParseError' && error.linePos) {
    return { line: error.linePos[0].line + 1, column: error.linePos[0].col }
  }

  if (error.line) {
    return { line: error.line, column: error.column ?? undefined }
  }

  // Some MDX messages only include the position in their text, e.g. "(3:1-3:20)"
  const place = message.match(/\((\d+):(\d+)-\d+:\d+\)/)
  if (place) {
    return { line: Number(place[1]), column: Number(place[2]) }
  }

  // Errors thrown while rendering have no position, so find what they refer to
  const component = message.match(/^Expected component `([^`]+)` to be defined/)
  if (component) {
    return findInSource(source, new RegExp(`<${escapeRegExp(component[1])}\\b`))
  }
  const reference = message.match(/^(\S+) is not defined$/)
  if (reference) {
    return findInSource(source, new RegExp(`\\{\\s*${escapeRegExp(reference[1])}\\b`))
  }

  return {}
}

export function toCompileError(error: unknown, source: string): CompileError {
  if (!(error instanceof Error)) {
    return { message: String(error) }
  }
  const err = error as ErrorLike
  // VFileMessage.reason is the message without the file name prefix
  const message = (err.reason ?? err.message).split('\n')[0]
  return {
    // YAML's own "at line 2, column 15" counts from inside the frontmatter, which
    // contradicts the corrected line number, so drop it
    message: err.name === 'YAMLParseError' ? message.replace(/ at line \d+, column \d+:?$/, '') : message,
    ...locate(err, message, source),
  }
}
