import { logger } from "@vendetta";
import { findByProps, findByStoreName } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";
import Settings from "./ui/Settings";

const ChannelStore = findByStoreName("ChannelStore");
const GuildStore = findByStoreName("GuildStore");
const SelectedChannelStore = findByStoreName("SelectedChannelStore");
const { allSummaries } = findByProps("allSummaries");
const { sendBotMessage } = findByProps("sendBotMessage");

const whitelistedGuilds = (storage.guildWhitelist ?? "").split(",");
const whitelistedChannels = [];
const knownSummaries = [];

function checkSummaries() {
  const currentChannel = SelectedChannelStore.getChannelId();
  if (!whitelistedChannels.includes(currentChannel)) {
    logger.log(`Adding selected channel ${currentChannel} to whitelist`);
    whitelistedChannels.push(currentChannel);
  }
  logger.log(`Whitelisted guilds: ${whitelistedGuilds.join(", ")}`);
  
  const all = Object.entries(allSummaries()); // [ server id, [ summaries ] ]
  all.forEach(([channelId, summaries]) => {
    summaries.forEach(summary => {
      if (knownSummaries.includes(summary.id)) return;
      knownSummaries.push(summary.id);
      logger.log(`Found new summary: `, summary);
      const channel = ChannelStore.getChannel(channelId);
      if (whitelistedGuilds.includes(channel.guild_id) || whitelistedChannels.includes(channel.id)) {
        notifyNewSummary(channel, summary);
      }
    });
  });
}

function notifyNewSummary(channel, summary) {
  const guild = GuildStore.getGuild(channel.guild_id);
  showToast(`${guild.name} > #${channel.name}: ${summary.topic}`);
  
  sendBotMessage(channel.id, [
    `## ${summary.topic}`,
    summary.summShort,
    `### [Jump to beginning](https://discord.com/channels/${channel.guild_id}/${channel.id}/${summary.startId})`,
    "",
    "-# Automated message by Summaries plugin"
  ].join("\n"));
}

const interval = setInterval(() => {
  checkSummaries();
}, 60000);

checkSummaries();

export const unpatch = () => clearInterval(interval);
export const settings = Settings;