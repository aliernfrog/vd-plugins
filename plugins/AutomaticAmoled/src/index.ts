import { findByProps, findByStoreName } from "@vendetta/metro";
import { logger } from "@vendetta";

const ThemeManager = findByProps("updateTheme", "overrideTheme");
const ThemeStore = findByStoreName("ThemeStore");
const UnsyncedUserSettingsStore = findByStoreName("UnsyncedUserSettingsStore");

export default {
    onLoad: () => {
      try {
        logger.log(`ThemeStore.theme = ${ThemeStore.theme}`);
        logger.log(`UnsyncedUserSettingsStore = ${UnsyncedUserSettingsStore.theme}`);
        logger.log(`${JSON.stringify(ThemeManager)}`);
      } catch(e) {
        logger.error("Failed to load AutomaticAmoled.", e);
      }
    }
}