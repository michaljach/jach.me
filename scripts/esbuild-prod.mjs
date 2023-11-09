import { build } from "esbuild";
import { copy } from "esbuild-plugin-copy";

await build({
  entryPoints: ["./src/index"],
  outdir: "dist",
  bundle: true,
  loader: {
    ".ts": "ts",
    ".css": "text",
  },
  jsxFactory: "h",
  chunkNames: "chunks/[name]-[hash]",
  format: "esm",
  splitting: true,
  minify: true,
  keepNames: true,
  inject: ["./node_modules/wcsx/dist/h"],
  define: { "window.ENV": '"production"' },
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: [
        {
          from: ["./src/styles.css"],
          to: ["./dist/styles.css"],
        },
        {
          from: ["./public/**/*"],
          to: ["./dist"],
        },
      ],
      watch: true,
    }),
  ],
});

console.log(`⚡ Built !`);
