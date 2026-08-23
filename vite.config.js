import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.resolve(__dirname, "public");

function serveMarkdown(request, response, next) {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  if (!pathname.endsWith(".md")) {
    next();
    return;
  }

  const relativePath = decodeURIComponent(pathname).replace(/^\/+/, "");
  const file = path.resolve(PUBLIC_DIR, relativePath);
  if (!file.startsWith(`${PUBLIC_DIR}${path.sep}`) || !fs.existsSync(file)) {
    next();
    return;
  }

  response.statusCode = 200;
  response.setHeader("Content-Type", "text/markdown; charset=utf-8");
  response.end(fs.readFileSync(file));
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "serve-static-markdown",
      configureServer(server) {
        server.middlewares.use(serveMarkdown);
      },
      configurePreviewServer(server) {
        server.middlewares.use(serveMarkdown);
      },
    },
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
