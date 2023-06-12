import { logger } from "@vendetta";
import { findByName, findByProps, findByStoreName } from "@vendetta/metro";
import { before } from "@vendetta/patcher";

const ThreadLongPressActionSheet = findByName("ThreadLongPressActionSheet");
const ActionSheet = findByProps("openLazy", "hideActionSheet");
const ChannelStore = findByStoreName("ChannelStore");

let patch;

export default {
  onLoad: () => {
    /*openLazyReal = ActionSheet.openLazy;
    
    ActionSheet.openLazy = (...args) => {
      const [ _, type, ctx ] = args;
      try {
        if (!needToPatchContextMenu(type, ctx)) return openLazyReal(...args);
      
        openLazyReal(
          Promise.resolve({ default: ThreadLongPressActionSheet }),
          "ThreadLongPressActionSheet",
          {
            channelId: ctx.channelId
          }
        );
      } catch (e) {
        logger.error(`Failed to patch ${type}`, e);
      }
    }*/

    patch = before("openLazy", ActionSheet, (args) => {
      const [ component, type, ctx ] = args;
      if (!needToPatchContextMenu(type, ctx)) return;

      args[0] = Promise.resolve({ default: ThreadLongPressActionSheet }),
      args[1] = "ThreadLongPressActionSheet",
      args[2] = {
        channelId: ctx.channelId
      }
    });
  },
  
  onUnload: () => {
    patch?.();
  }
}

function needToPatchContextMenu(type, ctx) {
  if (!type.startsWith("ChannelLongPress")) return false;
  const channel = ChannelStore.getChannel(ctx.channelId);
  return !!channel.threadMetadata;
}