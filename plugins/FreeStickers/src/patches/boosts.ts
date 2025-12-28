import { findByProps } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";

const StickerUtils = findByProps("getStickerSendability");
const SENDABLE = StickerUtils.StickerSendability.SENDABLE ?? 0;

export default () => {
  const patches = [
    // This makes locked stickers actually send on click
    instead("getStickerSendability", StickerUtils, () => SENDABLE),
    
    // This makes locked stickers appear fully opaque in sticker list
    instead("isSendableSticker", StickerUtils, () => true)
  ];
  
  return () => patches.forEach(p => p?.());
}