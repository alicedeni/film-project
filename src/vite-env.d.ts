/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KINOPOISK_API_URL?: string
  readonly VITE_KINOPOISK_API_KEY?: string
  readonly VITE_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
