import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
        server: {
            proxy: {
                // /donate --> NAV REQ (page)
                // /checkout -> HTTP REQ (API)
                // they dont have the same name no navigation REQ and http REQ confusion
                "/checkout": {
                    target: "http://localhost:3000",
                    changeOrigin: true,
                },
                "/programs": {
                    target: "http://localhost:3000",
                    changeOrigin: true,
                },
                "/admin/auth": {
                    target: "http://localhost:3000",
                    changeOrigin: true,
                }, 
                // KEEP ONLY API ROUTES
                "/admin/api": {
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
