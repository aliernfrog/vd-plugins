import { plugins, startPlugin } from "@vendetta/plugins";
import { storage } from "@vendetta/plugin";

const EXPERIMENTS_URL = "https://vd-plugins.github.io/proxy/beefers.github.io/strife/Experiments/";
let fixed = false;

export default function () {
  if (!storage.FixExperiments) return () => {};
  if (!plugins[EXPERIMENTS_URL]) return;
  
  setTimeout(() => {
    fixed = true;
    startPlugin(EXPERIMENTS_URL);
  }, 15000);

  return () => {};
}