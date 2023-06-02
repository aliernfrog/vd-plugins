import { logger } from "@vendetta";
import { findByName, findByProps } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import JumpButton from "./ui/JumpButton";

const ForumPostLongPressActionSheet = findByName("ForumPostLongPressActionSheet", false);
const { useFirstForumPostMessage } = findByProps("useFirstForumPostMessage");

let patch;

export default {
  onLoad: () => {
    patch = after("default", ForumPostLongPressActionSheet, ([{ thread }], res) => {
      const { firstMessage } = useFirstForumPostMessage(thread);
      
      if (!firstMessage) return logger.log(`Forum thread ${thread.id} doesn't have a starter message`);
      
      logger.log(`First message: ${JSON.stringify(firstMessage)}`);
      logger.log(`Thread: ${JSON.stringify(thread)}`);
      
      const firstMessageURL = `https://discord.com/channels/${thread.guild_id}/${thread.id}/${firstMessage.id}`;
      JumpButton(res, firstMessageURL);
    });
  },
  
  onUnload: () => {
    patch?.unpatch();
  }
}