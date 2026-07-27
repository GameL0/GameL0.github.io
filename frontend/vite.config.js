import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    root: 'src/pages',
    base: '/',
    plugins: [
        tailwindcss(),
    ],
    build: {
        outDir: '../../dist',
        emptyOutDir: true,
    }
})