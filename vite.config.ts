import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Lois-Halphiniria-calculator/', // ต้องตรงชื่อ repo เป๊ะ (Case-sensitive)
})
