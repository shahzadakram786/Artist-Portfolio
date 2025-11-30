import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

async function build() {
  console.log("🔨 Building project (client + server)...\n");

  try {
    // 1) Build client using Vite programmatically to avoid shell surprises on CI
    console.log("📦 Building client (Vite)...");
    const { build: viteBuild } = await import("vite");
    await viteBuild({
      configFile: path.join(rootDir, "vite.config.ts"),
      logLevel: "info",
    });
    console.log("✅ Client build complete!\n");

    // 2) Bundle server using esbuild API
    console.log("📦 Building server (esbuild)...");
    const { build: esbuild } = await import("esbuild");

    const distDir = path.join(rootDir, "dist");
    if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

    await esbuild({
      entryPoints: [path.join(rootDir, "server", "index.ts")],
      outfile: path.join(distDir, "index.cjs"),
      bundle: true,
      platform: "node",
      target: ["node18"],
      format: "cjs",
      sourcemap: false,
      external: ["pg", "better-sqlite3"],
      define: {
        "process.env.NODE_ENV": '"production"',
      },
    });

    console.log("✅ Server build complete!\n");

    console.log("✨ Build complete!");
    console.log(`📁 Output: ${distDir}`);
    console.log("🚀 Ready to deploy!\n");
  } catch (err) {
    console.error("❌ Build failed:", err);
    process.exit(1);
  }
}

build();
