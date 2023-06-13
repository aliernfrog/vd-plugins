import { findByName, findByProps, findByStoreName } from "@vendetta/metro";
import { before } from "@vendetta/patcher";

const ForumPostLongPressActionSheet = findByName("ForumPostLongPressActionSheet");
const ThreadLongPressActionSheet = findByName("ThreadLongPressActionSheet");
const ActionSheet = findByProps("openLazy", "hideActionSheet");
const ChannelStore = findByStoreName("ChannelStore");

let patch;

export default {
  onLoad: () => {
    patch = before("openLazy", ActionSheet, (args) => {
      const [ _, type, ctx ] = args;
      const override = getOverride(type, ctx);
      if (!override) return;

      args[0] = override.component;
      args[1] = override.type;
      args[2] = override.ctx;
    });
  },
  
  onUnload: () => {
    patch?.();
  }
}

function getOverride(type, ctx) {
  if (!type.startsWith("ChannelLongPress")) return null;
  const channel = ChannelStore.getChannel(ctx.channelId);
  if (!channel.parent_id || !channel.threadMetadata) return null;
  const parentChannel = ChannelStore.getChannel(channel.parent_id);
  const isForumThread = parentChannel.type == 15;
  return isForumThread ? {
    component: Promise.resolve({ default: ForumPostLongPressActionSheet }),
    type: "ForumPostLongPressActionSheet",
    ctx: {
      thread: channel,
      parentChannel: parentChannel,
      onClose: () => ActionSheet.hideActionSheet()
    }
  } : {
    component: Promise.resolve({ default: ThreadLongPressActionSheet }),
    type: "ThreadLongPressActionSheet",
    ctx: {
      channelId: ctx.channelId,
      onClose: () => ActionSheet.hideActionSheet()
    }
  }
}