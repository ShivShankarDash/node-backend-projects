import { serve } from "bun";
import { readFileSync } from "fs";
import { join } from "path";

const port = 3001;

// Read the HTML template
const html = readFileSync(join(import.meta.dir, "src/index.html"), "utf-8");

const server = serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Serve static assets
    if (url.pathname.startsWith("/src/")) {
      const filePath = join(import.meta.dir, url.pathname);
      try {
        const file = Bun.file(filePath);
        if (await file.exists()) {
          return new Response(file);
        }
      } catch (error) {
        // File not found, continue to SPA fallback
      }
    }

    // For all other routes, serve the React app
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
  
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 React app running at http://localhost:${port}`);