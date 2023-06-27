const { mkdirSync, readdirSync, readFileSync, writeFileSync } = require("fs");
const allColors = require("./all_colors.json");

const themeFiles = readdirSync("./themes/themes").filter(f => f.endsWith(".json"));
mkdirSync("./dist/themes");

for (const file of themeFiles) {
  try {
    const obj = require(`./themes/${file}`);
    let theme = { ... obj };
  
    if (theme.build) theme = buildTheme(theme);

    writeFileSync(`./dist/themes/${file}`, JSON.stringify(theme, null, 1));
    console.log(`Successfully built ${theme.name} theme!`);
  } catch (e) {
    console.error("Failed to build theme...", e);
  }
}

function buildTheme(theme) {
  const config = theme.build;
  const semanticColorsConfig = config.semanticColors;

  if (semanticColorsConfig) {
    if (semanticColorsConfig.useDefaults) theme.semanticColors = allColors.semanticColors;
    
    if (theme.semanticColors) {
      const newSemanticColors = {};
      const oldSemanticColors = theme.semanticColors;
      theme.semanticColors = {};
      
      Object.keys(oldSemanticColors).forEach(key => {
        const color = oldSemanticColors[key];
        let modified = 0;

        const setIndex = semanticColorsConfig.setIndex;
        if (setIndex) {
          if (color[setIndex[0]] != color[setIndex[1]]) modified++;
          color[setIndex[0]] = color[setIndex[1]];
        }

        const override = semanticColorsConfig.overrides.find(o => o.key == key);
        if (override) {
          override.index = [].concat(override.index ?? 0);
          override.index.forEach(index => {
            if (color[index] != override.value) modified++;
            color[index] = override.value;
          });
        }
        
        if (modified) newSemanticColors[key] = color;
      });

      theme.semanticColors = newSemanticColors;
    }
  }

  delete theme.build;
  return theme;
}