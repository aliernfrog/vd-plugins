import { findByStoreName } from "@vendetta/metro";

const { getChannel } = findByStoreName("ChannelStore");

export const defaultStickerURL = "https://media.discordapp.net/stickers/{stickerId}.{extension}?size=160";

export function isStickerAvailable(sticker, channelId) {
  if (!sticker.guild_id) return true; // Not from a guild, default sticker. No Nitro needed.
  const channelGuildId = getChannel(channelId).guild_id;
  if (sticker.guild_id == channelGuildId) return true; // Sticker is from current guild. No Nitro needed.
  return false;
}

export function buildStickerURL(baseURL, sticker) {
  return baseURL 
    .replace("{stickerId}", sticker.id)
    .replace("{extension}", "png");
}