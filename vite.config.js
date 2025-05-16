import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig({
  optimizeDeps:{
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material/Tooltip'
    ],
  },
  resolve:{
    alias:{
      '@UIComponents': path.resolve(__dirname, 'src/global/UIComponents.jsx')
    }
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
