import { serve } from "bun";
import { readFileSync } from "fs";
import { join } from "path";

const port = 3001;

const server = serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    
    console.log(`Request for: ${pathname}`);
    
    // Handle specific routes
    if (pathname === "/" || pathname === "/index.html") {
      const html = readFileSync(join(import.meta.dir, "index.html"), "utf-8");
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    }
    
    // Handle index.css - compile Tailwind
    if (pathname === "/index.css") {
      try {
        const cssPath = join(import.meta.dir, "index.css");
        const plugin = await import("bun-plugin-tailwind");
        const result = await Bun.build({
          entrypoints: [cssPath],
          target: "browser",
          format: "esm",
          minify: false,
          sourcemap: "none",
          plugins: [plugin.default],
        });
        
        if (result.success && result.outputs[0]) {
          const compiled = await result.outputs[0].text();
          return new Response(compiled, {
            headers: { "Content-Type": "text/css" },
          });
        } else {
          console.error("CSS Build failed:", result.logs);
          return new Response("CSS Build failed", { status: 500 });
        }
      } catch (error) {
        console.error("Error building index.css:", error);
        // Fallback: serve the raw CSS file
        try {
          const cssFile = Bun.file(join(import.meta.dir, "index.css"));
          if (await cssFile.exists()) {
            return new Response(cssFile, {
              headers: { "Content-Type": "text/css" },
            });
          }
        } catch (fallbackError) {
          console.error("Fallback CSS error:", fallbackError);
        }
        return new Response("CSS Build error", { status: 500 });
      }
    }
    
    // Handle frontend.tsx - compile and serve
    if (pathname === "/frontend.tsx") {
      try {
        const frontendPath = join(import.meta.dir, "frontend.tsx");
        const result = await Bun.build({
          entrypoints: [frontendPath],
          target: "browser",
          format: "esm",
          minify: false,
          sourcemap: "none",
        });
        
        if (result.success && result.outputs[0]) {
          const compiled = await result.outputs[0].text();
          return new Response(compiled, {
            headers: { "Content-Type": "application/javascript" },
          });
        } else {
          console.error("Build failed:", result.logs);
          return new Response("Build failed", { status: 500 });
        }
      } catch (error) {
        console.error("Error building frontend.tsx:", error);
        return new Response("Build error", { status: 500 });
      }
    }
    
    // Handle other static files
    if (pathname.startsWith("/src/")) {
      try {
        const filePath = join(import.meta.dir, pathname.replace("/src/", ""));
        const file = Bun.file(filePath);
        if (await file.exists()) {
          return new Response(file);
        }
      } catch (error) {
        console.error("Error serving file:", error);
      }
    }
    
    // Fallback to index.html for SPA routing
    const html = readFileSync(join(import.meta.dir, "index.html"), "utf-8");
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  },
  
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 React app running at http://localhost:${port}`);
