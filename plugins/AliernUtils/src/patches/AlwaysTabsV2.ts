import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const TabsUIManager = findByProps("toggleTabsUIManually");

export default function () {
  if (!storage.AlwaysTabsV2) return;

  const originalValue = TabsUIManager.isTabsUIEnabledManually();
  if (originalValue) return; // Tabs v2 is already enabled

  TabsUIManager.toggleTabsUIManually(true);

  return function () {
    TabsUIManager.toggleTabsUIManually(originalValue);
  }
}