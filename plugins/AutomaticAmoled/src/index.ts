import { findByProps, findByStoreName } from "@vendetta/metro";
import { logger } from "@vendetta";

const AMOLEDThemeManager = findByProps("setAMOLEDThemeEnabled");
const ThemeStore = findByStoreName("ThemeStore");
const UnsyncedUserSettingsStore = findByStoreName("UnsyncedUserSettingsStore");

export default {
      try {
        const theme = ThemeStore.theme || "dark";
        const amoled = UnsyncedUserSettingsStore.useAMOLEDTheme;
        const amoledEnabled = amoled == 2;
        
        logger.log(`Current theme: ${theme}`);
        logger.log(`AMOLED value: ${amoled}, enabled: ${amoledEnabled}`);
        
        if (theme != "dark" && amoledEnabled) {
          logger.log("Disabling AMOLED since dark theme is not enabled");
          AMOLEDThemeManager.setAMOLEDThemeEnabled(false);
        } else if (!amoledEnabled) {
          logger.log("Enabling AMOLED");
          AMOLEDThemeManager.setAMOLEDThemeEnabled(true);
        } else {
          logger.log("No need to change preferences");
        }
      } catch(e) {
        logger.error("Failed to load AutomaticAmoled", e);
      }
    }
}