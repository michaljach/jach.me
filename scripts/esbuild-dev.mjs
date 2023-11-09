import { context } from "esbuild";
import { copy } from "esbuild-plugin-copy";

let ctx = await context({
  entryPoints: ["./src/index"],
  outdir: "build",
  bundle: true,
  loader: {
    ".ts": "ts",
    ".css": "text",
  },
  jsxFactory: "h",
  chunkNames: "chunks/[name]-[hash]",
  format: "esm",
  splitting: true,
  minify: false,
  inject: ["./node_modules/wcsx/dist/h"],
  define: { "window.ENV": '"development"' },
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: [
        {
          from: ["./src/styles.css"],
          to: ["./build/styles.css"],
        },
        {
          from: ["./public/**/*"],
          to: ["./build"],
        },
      ],
      watch: true,
    }),
  ],
});

await ctx.watch();

let { host, port } = await ctx.serve({
  servedir: "build",
});

console.log(`⚡ Watching... ${host}:${port}`);
