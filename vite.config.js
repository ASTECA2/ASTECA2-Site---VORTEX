import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '', // Deixe a base vazia para forçar caminhos relativos
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})