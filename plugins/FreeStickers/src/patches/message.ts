import { findByProps, findByStoreName } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { showToast } from "@vendetta/ui/toasts";
import * as APNGCache from "../APNGCache";
import { buildStickerURL, convertToGIF, isStickerAvailable } from "../utils";

const MessageModule = findByProps("sendMessage", "receiveMessage");
const { getStickerById } = findByStoreName("StickersStore");

export default () => instead("sendStickers", MessageModule, (args, orig) => {
  const [ channelId, stickerIds, _, extra ] = args;
  
  const stickers = stickerIds.map(stickerId => getStickerById(stickerId));
  const toModify = stickers.filter(s => !isStickerAvailable(s, channelId));
  showToast(`toModify.length: ${toModify.length}`)
  if (!toModify.length) return orig(...args);
  
  const sendStickers = async (ackedApng) => {
    if (ackedApng) storage.ackedApng = true;
    
    for (const sticker of toModify) {
      showToast(`Sending ${sticker.id}`)
      let stickerURL = buildStickerURL(sticker);
      if (sticker.format_type === 2) {
        // APNG needs to be converted to GIF
        showToast("Converting APNG sticker to GIF..");
        const gif = await convertToGIF(stickerURL);
        if (!gif) showToast("APNG conversion failed, check logs for more info");
        stickerURL = gif ?? stickerURL;
      }
      MessageModule.sendMessage(channelId, { content: stickerURL }, null, extra);
    }
  }
  
  sendStickers();
});