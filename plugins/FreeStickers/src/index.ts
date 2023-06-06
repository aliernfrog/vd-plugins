import { findByProps, findByStoreName } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";

const nitroInfo = findByProps("canUseStickersEverywhere");
const messageModule = findByProps("sendMessage", "receiveMessage");
const { getChannel } = findByStoreName("ChannelStore");
const { getStickerById } = findByStoreName("StickersStore");

const patches = [];

export default {
  onLoad: () => {
    patches.push(
      instead("canUseStickersEverywhere", nitroInfo, () => true)
    );
    
    const sendStickersOriginal = messageModule.sendStickers;
    patches.push(instead("sendStickers", messageModule, (args) => {
      const channelId = args[0];
      const stickerIds = args[1];
      const stickers = stickerIds.map(stickerId => getStickerById(stickerId));
      const stickersToModify = stickers.filter(sticker => !isStickerAvailable(sticker, channelId));
      if (!stickersToModify.length) return sendStickersOriginal(...args);
      
      const newContent = stickersToModify.map(sticker => buildStickerURL(sticker)).join("\n");
      messageModule.sendMessage(
        channelId,
        {
          content: newContent
        }
      );
    }));
  },
  
  onUnload: () => {
    patches.forEach(unpatch => unpatch?.());
  }
}

function isStickerAvailable(sticker, channelId) {
  if (!sticker.guild_id) return true; // Not from a guild, default sticker. No Nitro needed.
  const channelGuildId = getChannel(channelId).guild_id;
  if (sticker.guild_id == channelGuildId) return true; // Sticker is from current guild. No Nitro needed.
  return false;
}

function buildStickerURL(sticker, size = "160") {
  return `https://media.discordapp.net/stickers/${sticker.id}.png?size=${size}`;
}