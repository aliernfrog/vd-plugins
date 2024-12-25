import { findByProps, findByStoreName } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";
import { buildStickerURL, convertToGIF, isStickerAvailable } from "../utils";
import * as APNGCache from "../APNGCache";

import showApngAlert from "../ui/ApngAlert";
import showApngFail from "../ui/ApngFail";

const MessageModule = findByProps("sendMessage", "receiveMessage");
const { getStickerById } = findByStoreName("StickersStore");
const { getCurrentUser } = findByStoreName("UserStore");

export default () => instead("sendStickers", MessageModule, (args, orig) => {
  if (!storage.ignoreNitro && getCurrentUser?.().premiumType !== null) return orig(...args);
  const [ channelId, stickerIds, _, extra ] = args;
  
  const stickers = stickerIds.map(stickerId => getStickerById(stickerId));
  const toModify = stickers.filter(s => !isStickerAvailable(s, channelId));
  if (!toModify.length) return orig(...args);
  
  const sendStickers = async (ackedApng) => {
    if (ackedApng) storage.ackedApng = true;
    
    for (const sticker of toModify) {
      let stickerURL = buildStickerURL(sticker);
      if (sticker.format_type === 2 && storage.convertApng) {
        // APNG needs to be converted to GIF
        let cached = APNGCache.get(stickerURL);
        if (!cached) {
          showToast("Converting APNG sticker to GIF..");
          const gif = await convertToGIF(stickerURL);
          if (!gif) {
            showApngFail(storage.staticApngOnFail);
            if (!storage.staticApngOnFail) continue;
          }
          else APNGCache.set(stickerURL, gif);
          cached = gif;
        }
        stickerURL = cached ?? stickerURL;
      }
      if (storage.hyperlink && sticker.name) stickerURL = `[${sticker.name}](${stickerURL})`;
      MessageModule.sendMessage(channelId, { content: stickerURL }, null, extra);
    }
  }
  
  const showApngConfirmation = toModify.find(s => s.format_type == 2) && !storage.ackedApng;
  if (showApngConfirmation) showApngAlert(() => sendStickers(true));
  else sendStickers();
});