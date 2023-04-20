import { findByProps, findByStoreName } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";
import { logger } from "@vendetta";

import Settings from "./ui/Settings";

const AMOLEDThemeManager = findByProps("setAMOLEDThemeEnabled");
const ThemeStore = findByStoreName("ThemeStore");
const UnsyncedUserSettingsStore = findByStoreName("UnsyncedUserSettingsStore");

export default {
  onLoad: () => {
    try {
      storage.disableWhenLight ??= true;
      
      const theme = ThemeStore.theme || "dark";
      const amoled = UnsyncedUserSettingsStore.useAMOLEDTheme;
      const darkEnabled = theme == "dark";
      const amoledEnabled = amoled == 2;
      const disableWhenLight = storage.disableWhenLight;
        
      logger.log(`Current theme: ${theme}, dark mode: ${darkEnabled}`);
      logger.log(`AMOLED value: ${amoled}, enabled: ${amoledEnabled}`);
      logger.log(`Disable when light: ${disableWhenLight}`);
      
      if (darkEnabled && !amoledEnabled) {
        logger.log("Enabling AMOLED");
        AMOLEDThemeManager.setAMOLEDThemeEnabled(true);
      } else if (!darkEnabled && amoledEnabled && disableWhenLight) {
        // Having AMOLED + light theme causes theming issues on 174.6 (and probably wont be fixed)
        // Need to disable it when dark theme is not enabled
        logger.log("Disabling AMOLED since dark theme is not enabled");
        AMOLEDThemeManager.setAMOLEDThemeEnabled(false);
      } else {
        logger.log("No need to change preferences");
      }
    } catch(e) {
      logger.error("Failed to load AutomaticAmoled", e);
    }
  },
  settings: Settings
}