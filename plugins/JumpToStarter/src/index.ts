import { findByName, findByProps } from "@vendetta/metro";
import { logger } from "@vendetta";
import { after } from "@vendetta/patcher";

const ForumPostLongPressActionSheet = findByName("ForumPostLongPressActionSheet", false);
const { useFirstForumPostMessage } = findByProps("useFirstForumPostMessage");
const { jumpToMessage } = findByProps("jumpToMessage");

let patch;

export default {
  onLoad: () => {
    patch = after("default", ForumPostLongPressActionSheet, ([{ thread }], res) => {
      const { firstMessage } = useFirstForumPostMessage(thread);
      
      if (!firstMessage) return logger.log(`Forum thread ${thread.id} doesn't have a starter message`);
      
      logger.log(`First message: ${JSON.stringify(firstMessage)}`);
      
      jumpToMessage(firstMessage);
    });
  },
  
  onUnload: () => {
    patch?.unpatch();
  }
}