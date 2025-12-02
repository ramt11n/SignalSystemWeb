import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/' // Default for 'npm run dev'
  }

  if (command === 'build') {
    // Set base only for 'npm run build' (GitHub Pages)
    config.base = '/SignalSystemWeb/' 
  }

  return config
})