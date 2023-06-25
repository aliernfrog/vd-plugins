import { findByProps } from "@vendetta/metro";

const TabsUIManager = findByProps("toggleTabsUIManually");
const { ChatListAnimationExperiment } = findByProps("ChatListAnimationExperiment");

export default {
  onLoad: () => {
    if (!TabsUIManager.isTabsUIEnabledManually()) TabsUIManager.toggleTabsUIManually(true);

    ChatListAnimationExperiment.getCurrentConfig().shouldAnimateAndroid = true;
  }
}