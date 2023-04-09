import { findByProps, findByStoreName } from "@vendetta/metro";
import logger from "@lib/logger";

const ThemeManager = findByProps("updateTheme", "overrideTheme");
const ThemeStore = findByStoreName("ThemeStore");

export default {
    onLoad: () => {
        try {
          logger.log(`ThemeStore.theme = ${ThemeStore.theme}`);
          logger.log(`${ThemeManager}`);
        } catch (e) {
          logger.error("Failed to load AutomaticAmoled plugin.", e);
        }
    }
}