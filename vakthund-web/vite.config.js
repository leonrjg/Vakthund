import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs/promises';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 18000,
    },
    build: {
        rollupOptions: {
            onwarn(warning, warn) {
                if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
                    return;
                }
                warn(warning);
            },
        },
    },
    plugins: [react()],
});