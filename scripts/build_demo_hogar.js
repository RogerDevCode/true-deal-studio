const esbuild = require("esbuild");

esbuild.buildSync({
  entryPoints: ["demo-servicios-domiciliarios/src/main.jsx"],
  bundle: true,
  format: "iife",
  platform: "browser",
  outfile: "demo-servicios-domiciliarios/assets/app.js",
  minify: true,
});
