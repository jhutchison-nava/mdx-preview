/// <reference types="vite/client" />

declare module '*.css?url' {
  const url: string
  export default url
}

declare module '*.js?url' {
  const url: string
  export default url
}

declare module '*.scss?url' {
  const url: string
  export default url
}

declare module '*.worker?worker' {
  const Worker: new () => Worker
  export default Worker
}

declare module '*.html?raw' {
  const raw: string
  export default raw
}

declare module '*.svg?raw' {
  const raw: string
  export default raw
}
