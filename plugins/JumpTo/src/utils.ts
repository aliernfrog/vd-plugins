import { findByProps } from "@vendetta/metro";
import { url } from "@vendetta/metro/common";

const { openUrl } = findByProps("openUrl");

export function openURL(url) {
  if (openUrl) openUrl(url);
  else url?.openURL?.(url);
}

export function buildMessageURL(guild, channel, message) {
  return `https://discord.com/channels/${guild ?? "@me"}/${channel}/${message}`;
}

export function buildStarterURL(thread) {
  return buildMessageURL(thread.guild_id, thread.id, thread.id);
}