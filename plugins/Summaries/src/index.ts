import { logger } from "@vendetta";
import { before } from "@vendetta/patcher";
import { findByProps, findByStoreName } from "@vendetta/metro";
import { FluxDispatcher } from "@vendetta/metro/common";
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

function checkSummaries(channelSummariesPairs) {
  const currentChannel = SelectedChannelStore.getChannelId();
  if (!whitelistedChannels.includes(currentChannel)) {
    logger.log(`Adding selected channel ${currentChannel} to whitelist`);
    whitelistedChannels.push(currentChannel);
  }
  
  channelSummariesPairs.forEach(([channelId, summaries]) => {
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

const unpatchFlux = before("dispatch", FluxDispatcher, ([event]) => {
  if (event.type !== "CONVERSATION_SUMMARY_UPDATE") return;
  logger.log("Received CONVERSATION_SUMMARY_UPDATE dispatch: ", event);
  const summaries = event.summaries?.map?.(apiSummary => {
    // Turn API summary object to what we need in the client
    // currently, the plugin only uses the following fields
    return {
      id: apiSummary.id,
      topic: apiSummary.topic,
      summShort: apiSummary.summ_short,
      startId: apiSummary.start_id,
      endId: apiSummary.end_id
    }
  });
  if (summaries) checkSummaries([
    [ event.channel_id, summaries ]
  ]);
});

// Initial check for existing summaries
checkSummaries(Object.entries(allSummaries()));

export const unpatch = unpatchFlux;
export const settings = Settings;