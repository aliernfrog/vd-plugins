import { findByProps, findByStoreName } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { showConfirmationAlert } from "@vendetta/ui/alerts";
import { defaultStickerURL, buildStickerURL, isStickerAvailable } from "./utils";
import Settings from "./ui/Settings";

const nitroInfo = findByProps("canUseStickersEverywhere");
const messageModule = findByProps("sendMessage", "receiveMessage");
const { getStickerById } = findByStoreName("StickersStore");

const patches = [];

export default {
  onLoad: () => {
    storage.stickerURL ??= defaultStickerURL;
    
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

      const sendStickers = (confirmedDialog) => {
        if (confirmedDialog) storage.acknowledgedApng = true;
        const newContent = stickersToModify.map(sticker => buildStickerURL(storage.stickerURL, sticker)).join("\n");
        messageModule.sendMessage(
          channelId,
          {
            content: newContent
          }
        );
      }

      const showApngConfirmation = (!!stickersToModify.find(sticker => sticker.format_type == 2)) && !storage.acknowledgedApng;
      if (showApngConfirmation) {
        showConfirmationAlert({
          title: "APNG Stickers",
          content: "APNG stickers are not supported by FreeStickers and will be non-animated in chat. Do you want to send them anyway?",
          confirmText: "Send anyway",
          cancelText: "Cancel",
          onConfirm: () => {
            sendStickers(true)
          }
        })
      } else sendStickers();
    }));
  },
  
  onUnload: () => {
    patches.forEach(unpatch => unpatch?.());
  },

  settings: Settings
}