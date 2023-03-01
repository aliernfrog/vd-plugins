import { findByProps } from "@vendetta/metro";

const AMOLEDThemeManager = findByProps("setAMOLEDThemeEnabled");

export default {
    onLoad: () => {
        AMOLEDThemeManager.setAMOLEDThemeEnabled(true);
    }
}