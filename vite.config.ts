import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const raw = env.VITE_BASE?.trim()
  const base = !raw || raw === '/' ? '/' : raw.endsWith('/') ? raw : `${raw}/`

  let apiTarget = 'https://api.poiskkino.dev'
  let apiPath = '/v1.4'
  try {
    const url = new URL(env.VITE_KINOPOISK_API_URL || 'https://api.poiskkino.dev/v1.4')
    apiTarget = url.origin
    apiPath = url.pathname.replace(/\/$/, '') || '/v1.4'
  } catch {
    /* default values */
  }

  const apiKey = env.VITE_KINOPOISK_API_KEY

  return {
    base,
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/proxy-kp': {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/proxy-kp/, apiPath),
          ...(apiKey && {
            configure: (proxy) => {
              proxy.on('proxyReq', (req) => req.setHeader('X-API-KEY', apiKey))
            },
          }),
        },
      },
    },
  }
})
