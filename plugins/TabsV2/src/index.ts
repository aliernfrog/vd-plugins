import { findByProps } from "@vendetta/metro";

const TabsUIManager = findByProps("toggleTabsUIManually");

export default {
  onLoad: () => {
    if (!TabsUIManager.isTabsUIEnabledManually()) TabsUIManager.toggleTabsUIManually(true);
  }
}