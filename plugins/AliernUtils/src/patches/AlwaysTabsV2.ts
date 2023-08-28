import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const { toggleTabsUIManually } = findByProps("toggleTabsUIManually");

export default function () {
  toggleTabsUIManually(storage.AlwaysTabsV2);

  return () => {
    toggleTabsUIManually(false);
  }
}