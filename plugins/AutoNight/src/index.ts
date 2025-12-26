import { findByProps } from "@vendetta/metro";

const { getColorScheme } = findByProps("getColorScheme");
const { updateTheme } = findByProps("updateTheme");

const systemTheme = getColorScheme();

updateTheme(
  (systemTheme === "light") ? "light" : "midnight"
);