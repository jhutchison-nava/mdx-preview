import type { RehypeExpressiveCodeOptions } from 'rehype-expressive-code'

import fhirpathGrammar from 'src/grammars/fhirpath.tmLanguage.json'

// Mirrors the expressiveCode() options in bluebutton-site-static/astro.config.mjs
export const expressiveCodeOptions: RehypeExpressiveCodeOptions = {
  themes: ['github-light'],
  shiki: {
    langs: [fhirpathGrammar as any],
    langAlias: { fhirpath: 'Fhirpath' },
  },
  styleOverrides: {
    frames: {
      editorBackground: '#f7f9fa',
      terminalBackground: '#f7f9fa',
      frameBoxShadowCssValue: '0',
    },
    codeBackground: '#f7f9fa',
    uiFontSize: '0.85rem',
    codeFontSize: '1rem',
  },
}
