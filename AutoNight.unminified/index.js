(function(metro){'use strict';const { getColorScheme } = metro.findByProps("getColorScheme");
const { updateTheme } = metro.findByProps("updateTheme");
const systemTheme = getColorScheme();
updateTheme(systemTheme === "light" ? "light" : "midnight");})(vendetta.metro);