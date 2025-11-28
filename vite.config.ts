import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-payment-callback',
      closeBundle() {
        try {
          copyFileSync(
            path.resolve(__dirname, 'public/payment-callback.html'),
            path.resolve(__dirname, 'dist/payment-callback.html')
          )
          console.log('✅ payment-callback.html copied to dist root')
        } catch (err) {
          console.error('❌ Failed to copy payment-callback.html:', err)
        }
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-label', '@radix-ui/react-select', '@radix-ui/react-slot', '@radix-ui/react-tabs', '@radix-ui/react-toast'],
          'chart-vendor': ['recharts'],
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  publicDir: 'public'
})