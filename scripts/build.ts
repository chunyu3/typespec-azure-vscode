import { context } from "esbuild";
import { cp, mkdir, readdir } from "fs/promises";
import path from "path";

async function copyDirectory(src: string, dest: string) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      cp(srcPath, destPath);
    }
  }
}

//copy ai markdown
// copyDirectory("ai/azure", "dist/src/ai/azure");

// Build the extension
const nodeContext = await context({
  entryPoints: ["src/extension.ts"],
  bundle: true,
  outfile: "dist/src/extension.js",
  platform: "node",
  mainFields: ["module", "main"],
  target: "node22",
  format: "esm",
  sourcemap: true,
  external: ["vscode"]
});

if (process.argv.includes("--watch")) {
  console.log("Watching for changes...");
  // Watch the extension
  await Promise.all([nodeContext.watch()]);
} else {
  console.log("Building...");

  // Watch the extension
  await nodeContext.rebuild();
  nodeContext.dispose();
}
