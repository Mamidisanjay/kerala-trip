import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const nodeEnv = globalThis.process?.env || {}
const repoName = nodeEnv.GITHUB_REPOSITORY?.split('/')[1] || 'kerala-trip'

export default defineConfig({
  base: nodeEnv.VITE_BASE_PATH || (nodeEnv.NODE_ENV === 'production' ? `/${repoName}/` : '/'),
  plugins: [react()],
})
