import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/*.mp3', '**/*.wav', '**/*.m4a', '**/*.aac', '**/*.ogg', '**/*.flac']
    }
  }
})
