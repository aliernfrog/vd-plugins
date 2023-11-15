import { find, findByProps, findByStoreName } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { showConfirmationAlert } from "@vendetta/ui/alerts";
import { buildStickerURL, isStickerAvailable } from "./utils";
import Settings from "./ui/Settings";

// On 194.4+, this nitro module is frozen
// original fix from enmity plugin: https://github.com/colin273/enmity-plugins/blob/master/Freemoji/src/index.ts#L59
// vendetta version: https://discord.com/channels/1015931589865246730/1062531774187573308/1149552971235995698
const nitroModule = find(m => m.default?.canUseAnimatedEmojis);
nitroModule.default = { ... nitroModule.default }

const messageModule = findByProps("sendMessage", "receiveMessage");
const { getStickerById } = findByStoreName("StickersStore");

// Somewhere after 204.0, Discord renamed the method
// "canUseStickersEverywhere" -> "canUseCustomStickersEverywhere"
// Check if old method exists, use new method name if not
const OLD_CHECK_NAME = "canUseStickersEverywhere";
const NEW_CHECK_NAME = "canUseCustomStickersEverywhere";
const CHECK_NAME = nitroModule?.default[OLD_CHECK_NAME] ? OLD_CHECK_NAME : NEW_CHECK_NAME;

const patches = [
  instead(CHECK_NAME, nitroModule.default, () => true),
  
  instead("sendStickers", messageModule, (args, orig) => {
    const [ channelId, stickerIds, _, extra ] = args;
    
    const stickers = stickerIds.map(stickerId => getStickerById(stickerId));
    const stickersToModify = stickers.filter(sticker => !isStickerAvailable(sticker, channelId));
    if (!stickersToModify.length) return orig(...args);

    const sendStickers = (confirmedDialog) => {
      if (confirmedDialog) storage.acknowledgedApng = true;
      const newContent = stickersToModify.map(sticker => buildStickerURL(storage.stickerURL, sticker)).join("\n");
      messageModule.sendMessage(
        channelId,
        {
          content: newContent
        },
        null,
        extra
      );
    }

    const showApngConfirmation = stickersToModify.find(sticker => sticker.format_type == 2) && !storage.acknowledgedApng;
    if (!showApngConfirmation) sendStickers();
    else showConfirmationAlert({
      title: "APNG Stickers",
      content: "APNG stickers are not supported by FreeStickers and will be non-animated in chat. Do you want to send them anyway?",
      confirmText: "Send anyway",
      cancelText: "Cancel",
      onConfirm: () => {
        sendStickers(true);
      }
    });
  })
];

export const settings = Settings;
export const onUnload = () => patches.forEach(p => p?.());