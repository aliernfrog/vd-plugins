import { logger } from "@vendetta";
import { findByProps } from "@vendetta/metro";
import { before, instead } from "@vendetta/patcher";

const nitroInfo = findByProps("canUseStickersEverywhere");
const messageModule = findByProps("sendMessage", "receiveMessage");

const patches = [];

export default {
  onLoad: () => {
    if (nitroInfo.canUseStickersEverywhere()) return logger.log("User has Nitro, no need to patch stickers");
    
    patches.push(
      instead("canUseStickersEverywhere", nitroInfo, () => true);
    );
    
    patches.push(before("sendMessage", messageModule, (args) => {
      const message = args[1];
      
      if (!message?.stickerItems?.length) return;
      
      const toModify = message.stickerItems.filter(sticker => !isStickerAvailable(sticker));
      if (!toModify.length) return;
      
      message.content = toModify.map(sticker => buildStickerURL(sticker)).join("\n");
      message.stickers = [];
      message.stickerItems = [];
    }));
  },
  
  onUnload: () => {
    patches.forEach(unpatch => unpatch?.());
  }
}

function isStickerAvailable(sticker) {
  const isCustom = (sticker.format_type == 1 || // PNG
    sticker.format_type == 2 || // APNG
    sticker.format_type == 4 // GIF
  );
  if (!isCustom) return true;
  return false;
}

function buildStickerURL(sticker, size = "256") {
  return `https://cdn.discordapp.net/stickers/${sticker.id}.png?size=256`;
}