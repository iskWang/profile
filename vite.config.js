import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "serve-slides",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/slides" || req.url === "/slides/") {
            const file = path.resolve(__dirname, "public/slides/index.html");
            res.setHeader("Content-Type", "text/html");
            res.end(fs.readFileSync(file));
          } else {
            next();
          }
        });
      },
    },
  ],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
