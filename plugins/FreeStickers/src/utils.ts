import { logger } from "@vendetta";
import { findByStoreName } from "@vendetta/metro";

const { getChannel } = findByStoreName("ChannelStore");

const baseStickerURL = "https://media.discordapp.net/stickers/{stickerId}.png?size={size}";

export function isStickerAvailable(sticker, channelId) {
  if (!sticker.guild_id) return true; // Not from a guild, default sticker. No Nitro needed.
  const channelGuildId = getChannel(channelId).guild_id;
  return sticker.guild_id == channelGuildId;
}

export function buildStickerURL(sticker) {
  return baseStickerURL
    .replace("{stickerId}", sticker.id)
    .replace("{size}", "160");
}

export async function convertToGIF(stickerUrl) {
  try {
    // Upload APNG and get its ID
    let form = new FormData();
    form.append("new-image-url", stickerUrl);
    let response = await fetch(`https://ezgif.com/apng-to-gif`, {
      method: "POST",
      body: form
    });
    let file_id = response.url.split("/").pop();

    // Convert uploaded APNG to GIF
    form = new FormData();
    form.append("file", file_id);
    form.append("size", "160");
    response = await fetch(`https://ezgif.com/apng-to-gif/${file_id}?ajax=true`, {
      method: "POST",
      body: form
    });
    let content = await response.text();
    return `https:${content.split('<img src="')[1].split('" style=')[0]}`;
  } catch (e) {
    logger.error(`Failed to convert ${stickerUrl} to GIF: `, e);
    return null;
  }
}