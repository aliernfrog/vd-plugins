import { logger } from "@vendetta";
import { findByStoreName } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const { getChannel } = findByStoreName("ChannelStore");
const { getCurrentUser } = findByStoreName("UserStore");

const baseStickerURL = "https://media.discordapp.net/stickers/{stickerId}.{format}?size={size}";

export function isStickerAvailable(sticker, channelId) {
  // sticker.available is false when guild loses boost level and sticker becomes unavailable
  // Even with the patches in patches/boosts.ts, sticker.available still reflects the actual status, which is good for us
  // Not sure if it can be null (would probably mean available?), so check if explicitly false
  if (sticker.available === false) return false;
  if (!sticker.guild_id) return true; // Not from a guild, default sticker. No Nitro needed.
  if (!storage.ignoreNitro && getCurrentUser?.().premiumType !== null) return true; // User has Nitro, should be usable
  const channelGuildId = getChannel(channelId).guild_id;
  return sticker.guild_id == channelGuildId;
}

export function buildStickerURL(sticker) {
  const format = (sticker.format_type === 4) ? "gif" : "png";
  return baseStickerURL
    .replace("{stickerId}", sticker.id)
    .replace("{format}", format)
    .replace("{size}", storage.stickerSize.toString());
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
    const fileId = response.url.split("/").pop().replace(/\.html$/, '');
    
    // Convert uploaded APNG to GIF
    form = new FormData();
    form.append("file", fileId);
    form.append("size", storage.stickerSize.toString());
    response = await fetch(`https://ezgif.com/apng-to-gif/${fileId}.html?ajax=true`, {
      method: "POST",
      body: form
    });
    const content = await response.text();
    return `https:${content.split('<img src="')[1].split('" style=')[0]}`;
  } catch (e) {
    logger.error(`Failed to convert ${stickerUrl} to GIF: `, e);
    return null;
  }
}