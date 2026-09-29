// The editor's content is kept in localStorage so it survives reloads. Access is
// wrapped in try/catch because storage can be unavailable (private mode, blocked
// site data) and the app should still work, just without persistence.

const STORAGE_KEY = 'mdx-preview:content'

export function loadContent() {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  }
  catch {
    return null
  }
}

export function saveContent(markdown: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, markdown)
  }
  catch (error) {
    console.error('Could not save content:', error)
  }
}

export function clearContent() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  }
  catch (error) {
    console.error('Could not clear content:', error)
  }
}
