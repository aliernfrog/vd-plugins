import Settings from "./ui/Settings";
import AlwaysTabsV2 from "./patches/AlwaysTabsV2";
import ChatAnimations from "./patches/ChatAnimations";
import NoLinkMarkdown from "./patches/NoLinkMarkdown";

let patches = [];

function reload() {
  unpatch();
  patches = [
    AlwaysTabsV2(),
    ChatAnimations(),
    NoLinkMarkdown()
  ];
}

function unpatch() {
  patches?.forEach(p => p?.());
}

reload();

export const settings = Settings(reload);
export const onUnload = () => unpatch();