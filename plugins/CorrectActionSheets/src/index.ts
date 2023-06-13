import { logger } from "@vendetta";
import { findByName, findByProps, findByStoreName } from "@vendetta/metro";
import { before } from "@vendetta/patcher";

const ThreadLongPressActionSheet = findByName("ThreadLongPressActionSheet");
const ActionSheet = findByProps("openLazy", "hideActionSheet");
const ChannelStore = findByStoreName("ChannelStore");

let patch;

export default {
  onLoad: () => {
    patch = before("openLazy", ActionSheet, (args) => {
      const [ component, type, ctx ] = args;
      if (!needToPatchContextMenu(type, ctx)) return;

      args[0] = Promise.resolve({ default: ThreadLongPressActionSheet }),
      args[1] = "ThreadLongPressActionSheet",
      args[2] = {
        channelId: ctx.channelId,
        onClose: () => {
          ActionSheet.hideActionSheet();
        }
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