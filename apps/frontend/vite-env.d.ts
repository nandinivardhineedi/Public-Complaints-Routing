/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // Add any other variables you might use from import.meta.env
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}