const SEMANTICS_SOURCE = "https://raw.githubusercontent.com/nexpid/Themelings/refs/heads/data/semantic_simple.json";

const obj = {
  name: "DarkNight",
  description: "Replaces dark theme colors with midnight ones.",
  spec: 2,
  authors: [{
    name: "aliernfrog",
    id: "459370047652102154"
  }],
  semanticColors: {
    /* key: [ dark, light, midnight ] */
  }
}

export default async function () {
  const semanticsRes = await fetch(SEMANTICS_SOURCE);
  const semantics = await semanticsRes.json();
  
  for (const [key, color] of Object.entries(semantics)) {
    obj.semanticColors[key] = [ color.midnight ];
  }
  
  return JSON.stringify(obj, null, 2);
}