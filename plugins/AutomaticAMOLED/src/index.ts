import { findByProps, findByStoreName } from "@vendetta/metro";
import { logger } from "@vendetta";

const AMOLEDThemeManager = findByProps("setAMOLEDThemeEnabled");
const ThemeStore = findByStoreName("ThemeStore");
const UnsyncedUserSettingsStore = findByStoreName("UnsyncedUserSettingsStore");

export default {
  onLoad: () => {
    try {
      const theme = ThemeStore.theme || "dark";
      const amoled = UnsyncedUserSettingsStore.useAMOLEDTheme;
      const darkEnabled = theme == "dark";
      const amoledEnabled = amoled == 2;
        
      logger.log(`Current theme: ${theme}, dark mode: ${darkEnabled}`);
      logger.log(`AMOLED value: ${amoled}, enabled: ${amoledEnabled}`);
        
      if (darkEnabled && !amoledEnabled) {
        logger.log("Enabling AMOLED");
        AMOLEDThemeManager.setAMOLEDThemeEnabled(true);
      } else if (!darkEnabled && amoledEnabled) {
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
  }
}