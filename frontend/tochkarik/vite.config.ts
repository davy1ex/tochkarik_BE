import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'




// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.SOME_KEY)
    },
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173
    }
  }
})
