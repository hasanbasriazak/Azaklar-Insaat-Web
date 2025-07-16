import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        // Gereksiz assets klasörlerini build'e dahil etme
        'src/assets/bagcilar_meydan_life/**',
        'src/assets/fatih_gulbahce_konagi/**',
        'src/assets/haznedar_park/**'
      ]
    }
  },
  publicDir: 'public' // Sadece public klasöründeki dosyaları kopyala
})
