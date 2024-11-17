import { find, findByProps, findByStoreName } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import { showConfirmationAlert } from "@vendetta/ui/alerts";
import { showToast } from "@vendetta/ui/toasts";
import { buildStickerURL, isStickerAvailable } from "./utils";
import Settings from "./ui/Settings";

const nitroModule = find((m) => m.default?.canUseAnimatedEmojis);
const messageModule = findByProps("sendMessage", "receiveMessage");
const { getStickerById } = findByStoreName("StickersStore");

// Somewhere after 204.0, Discord renamed the method
// "canUseStickersEverywhere" -> "canUseCustomStickersEverywhere"
// Check if old method exists, use new method name if not
const OLD_CHECK_NAME = "canUseStickersEverywhere";
const NEW_CHECK_NAME = "canUseCustomStickersEverywhere";
const CHECK_NAME = nitroModule?.default[OLD_CHECK_NAME]
  ? OLD_CHECK_NAME
  : NEW_CHECK_NAME;

async function sendAnimatedSticker(stickerLink: string, channelId: string) {
  // Upload gif
  let form = new FormData();
  form.append("new-image-url", stickerLink);
  let response = await fetch(`https://ezgif.com/apng-to-gif`, {
    method: "POST",
    body: form,
  });
  let file_id = response.url.split("/").pop();

  // Convert apng to gif
  form = new FormData();
  form.append("file", file_id);
  form.append("size", "160");
  response = await fetch(`https://ezgif.com/apng-to-gif/${file_id}?ajax=true`, {
    method: "POST",
    body: form,
  });
  let content = await response.text();
  let gif_url = `https:${content.split('<img src="')[1].split('" style=')[0]}`;

  // Send gif
  messageModule.sendMessage(channelId, { content: gif_url });
}

const patches = [
  instead(CHECK_NAME, nitroModule.default, () => true),

  instead("sendStickers", messageModule, (args, orig) => {
    const [channelId, stickerIds, _, extra] = args;

    const stickers = stickerIds.map((stickerId) => getStickerById(stickerId));
    const stickersToModify = stickers.filter(
      (sticker) => !isStickerAvailable(sticker, channelId),
    );
    if (!stickersToModify.length) return orig(...args);

    const sendStickers = async (confirmedDialog?: boolean) => {
      if (confirmedDialog) storage.acknowledgedApng = true;

      for (const sticker of stickersToModify) {
        const stickerUrl = buildStickerURL(storage.stickerURL, sticker);
        if (sticker.format_type === 2) {
          // APNG
          showToast("Converting APNG sticker to GIF..");
          await sendAnimatedSticker(stickerUrl, channelId);
        } else {
          messageModule.sendMessage(
            channelId,
            { content: stickerUrl },
            null,
            extra,
          );
        }
      }
    };

    const showApngConfirmation =
      stickersToModify.find((sticker) => sticker.format_type == 2) &&
      !storage.acknowledgedApng;
    if (!showApngConfirmation) sendStickers();
    else
      showConfirmationAlert({
        title: "APNG Stickers",
        content:
          "APNG stickers will be converted to GIF using Ezgif and an Ezgif link will be sent in chat. Do you want to continue?",
        confirmText: "Continue",
        cancelText: "Cancel",
        onConfirm: () => {
          sendStickers(true);
        },
      });
  }),
];

export const settings = Settings;
export const onUnload = () => patches.forEach((p) => p?.());
