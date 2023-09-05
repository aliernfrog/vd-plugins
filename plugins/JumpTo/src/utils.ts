export function buildMessageURL(guild, channel, message) {
  return `https://discord.com/channels/${guild ?? "@me"}/${channel}/${message}`;
}

export function buildStarterURL(thread) {
  return buildMessageURL(thread.guildId, thread.id, thread.id);
}