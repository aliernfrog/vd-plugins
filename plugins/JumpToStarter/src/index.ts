import { findByName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import JumpButton from "./ui/JumpButton";

const ForumPostLongPressActionSheet = findByName("ForumPostLongPressActionSheet", false);

let patch;

export default {
  onLoad: () => {
    patch = after("default", ForumPostLongPressActionSheet, ([{ thread }], res) => {
      const firstMessageURL = `https://discord.com/channels/${thread.guild_id}/${thread.id}/${thread.id}`;
      JumpButton(res, firstMessageURL);
    });
  },
  
  onUnload: () => {
    patch?.unpatch();
  }
}