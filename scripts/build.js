const jetpack = require("fs-jetpack");
const esbuild = require("esbuild");
const esbuildPluginTsc = require("esbuild-plugin-tsc");

const sourceDir = jetpack.path("./src");
const outputDir = jetpack.path("./dist");

const inputFile = jetpack.path(sourceDir, "index.ts");
const outputFile = jetpack.path(outputDir, "index.js");

esbuild.build({
    entryPoints: [inputFile],
    outfile: outputFile,
    bundle: true,
    format: "cjs",
    platform: "node",
    plugins: [ esbuildPluginTsc() ]
});