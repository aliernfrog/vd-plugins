import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import { extname } from "path";
import { createHash } from "crypto";

import { rollup } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import swc from "@swc/core";

const extensions = [".js", ".jsx", ".mjs", ".ts", ".tsx", ".cts", ".mts"];

const pluginWebsite = "https://aliernfrog.github.io/vd-plugins";
const sourceWebsite = "https://github.com/aliernfrog/vd-plugins/tree/master/plugins";
const readmePlugins = [];

/** @type import("rollup").InputPluginOption */
const plugins = (minify = true) => [
  nodeResolve(),
  commonjs(),
  {
    name: "swc",
    async transform(code, id) {
      const ext = extname(id);
      if (!extensions.includes(ext)) return null;

      const ts = ext.includes("ts");
      const tsx = ts ? ext.endsWith("x") : undefined;
      const jsx = !ts ? ext.endsWith("x") : undefined;

      const result = await swc.transform(code, {
        filename: id,
        jsc: {
          externalHelpers: true,
          parser: {
            syntax: ts ? "typescript" : "ecmascript",
            tsx,
            jsx,
          },
        },
        env: {
          targets: "defaults",
          include: [
            "transform-classes",
            "transform-arrow-functions",
          ],
        },
      });
      return result.code;
    },
  },
  esbuild({ minify })
];

for (let plug of await readdir("./plugins")) {
  const manifest = JSON.parse(await readFile(`./plugins/${plug}/manifest.json`));
  const outPath = `./dist/${plug}/index.js`;
  
  try {
    const bundle = await rollup({
      input: `./plugins/${plug}/${manifest.main}`,
      onwarn: () => {},
      plugins
    });
    
    await bundle.write({
      file: outPath,
      globals(id) {
        if (id.startsWith("@vendetta")) return id.substring(1).replace(/\//g, ".");
        const map = {
          react: "window.React",
        }

        return map[id] || null;
      },
      format: "iife",
      compact: true,
      exports: "named",
    });
    await bundle.close();
    
    const toHash = await readFile(outPath);
    manifest.hash = createHash("sha256").update(toHash).digest("hex");
    manifest.main = "index.js";
    
    readmePlugins.push({
      id: plug,
      ...manifest
    });
    delete manifest.aliern;
    
    await writeFile(`./dist/${plug}/manifest.json`, JSON.stringify(manifest));
    
    console.log(`Successfully built plugin: ${manifest.name}`);
  } catch (e) {
    console.error(`Failed to build ${plug} plugin:`, e);
    process.exit(1);
  }
}

await mkdir("./dist/themes");
for (let theme of (await readdir("./themes")).filter(f => f.endsWith(".js"))) {
  try {
    const themeModule = await import(`./themes/${theme}`);
    theme = theme.substring(0, theme.length-3);
    const themeStr = await themeModule.default();
    
    await writeFile(`./dist/themes/${theme}.json`, themeStr);
    console.log(`Successfully built theme: ${theme}`);
  } catch (e) {
    console.error(`Failed to build ${theme} theme:`, e);
    process.exit(1);
  }
}

async function buildReadme() {
  const template = await readFile("./README_template");
  const pluginsText = readmePlugins.map(plugin => {
    const installURL = `${pluginWebsite}/${plugin.id}`;
    const source = `${sourceWebsite}/${plugin.id}`;
    const forkOf = plugin.aliern?.forkOf;
    const status = plugin.aliern?.status ?? "stable";
    
    return [
      `## [${plugin.name}](${installURL})${forkOf ? " (fork)" : ""}`,
      forkOf ? `**Forked from: [${forkOf}](https://github.com/${forkOf})**` : null,
      plugin.description,
      `**Status:** ${status == "discontinued" ? "🪦 Discontinued" : status == "alpha" ? "💣 Alpha (UNSTABLE)" : "⛱️ Stable"}`,
      `\`${installURL}\``,
      `<button onClick="navigator.clipboard.writeText('${installURL}')">📥 Copy install URL</button> `
        + `<a href="${source}"><button>🧪 Source code</button></a>`
    ].filter(l => !!l).join("\n\n");
  }).join("\n\n");
  
  const text = template.toString().replaceAll("<PluginList />", pluginsText);
  await writeFile("./README.md", text);
  
  console.log("Successfully built README!");
}

buildReadme();