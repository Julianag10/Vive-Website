import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
        server: {
            proxy: {
                "/checkout": {
                    target: "http://localhost:3000",
                    changeOrigin: true,
                },
                // KEEP ONLY API ROUTES
                "/admin/api": {
                    target: "http://localhost:3000",
                    changeOrigin: true,
                },
                "/programs/api": {
                    target: "http://localhost:3000",
                    changeOrigin: true,
                },
            },
        },
});
// why dose http://localhost:5173/admin/donations returun index.html
// can you explain why it wasn tworking before 

// FRONT END DEV SERVER: http://localhost:5173/admin/donations
// front end server -> returns index.html file 
// the code tries res.json() -> cant parse HTMLinto Java Scipt because HTML isnt text (JSON)
// code needs to do res.json because stuff is sent over API adn endpoints via JSON text
// responses can only be sent in JSON text
// becuase stuff is sent overnetwrk (from server to server) server communicatte via netwrok 
