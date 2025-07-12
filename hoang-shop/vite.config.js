import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": "/src",
            "@components": "/src/components",
            "@assets": "/src/assets",
            "@pages": "/src/Pages",
            "@services": "/src/Services",
            tinymce: "tinymce/tinymce.js",
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
