(function(exports,_vendetta,patcher,metro,common,plugin,toasts,storage,components){'use strict';const { Stack, TableRowGroup, TextInput } = metro.findByProps("Stack", "TableRowGroup");
const { ScrollView } = components.General;
plugin.storage.guildWhitelist ??= "";
function Settings() {
  storage.useProxy(plugin.storage);
  return /* @__PURE__ */ React.createElement(ScrollView, {
    style: {
      flex: 1
    },
    contentContainerStyle: {
      paddingBottom: 38
    }
  }, /* @__PURE__ */ React.createElement(Stack, {
    style: {
      paddingVertical: 24,
      paddingHorizontal: 12
    },
    spacing: 24
  }, /* @__PURE__ */ React.createElement(TableRowGroup, {
    title: "Server whitelist"
  }, /* @__PURE__ */ React.createElement(TextInput, {
    value: plugin.storage.guildWhitelist,
    onChange: function(v) {
      return plugin.storage.guildWhitelist = v;
    }
  }))));
}const ChannelStore = metro.findByStoreName("ChannelStore");
const GuildStore = metro.findByStoreName("GuildStore");
const SelectedChannelStore = metro.findByStoreName("SelectedChannelStore");
const { allSummaries } = metro.findByProps("allSummaries");
const { sendBotMessage } = metro.findByProps("sendBotMessage");
const whitelistedGuilds = (plugin.storage.guildWhitelist ?? "").split(",");
const whitelistedChannels = [];
const knownSummaries = [];
function checkSummaries(channelSummariesPairs) {
  const currentChannel = SelectedChannelStore.getChannelId();
  if (!whitelistedChannels.includes(currentChannel)) {
    _vendetta.logger.log(`Adding selected channel ${currentChannel} to whitelist`);
    whitelistedChannels.push(currentChannel);
  }
  channelSummariesPairs.forEach(function(param) {
    let [channelId, summaries] = param;
    summaries.forEach(function(summary) {
      if (knownSummaries.includes(summary.id))
        return;
      knownSummaries.push(summary.id);
      _vendetta.logger.log(`Found new summary: `, summary);
      const channel = ChannelStore.getChannel(channelId);
      if (whitelistedGuilds.includes(channel.guild_id) || whitelistedChannels.includes(channel.id)) {
        notifyNewSummary(channel, summary);
      }
    });
  });
}
function notifyNewSummary(channel, summary) {
  const guild = GuildStore.getGuild(channel.guild_id);
  toasts.showToast(`${guild.name} > #${channel.name}: ${summary.topic}`);
  sendBotMessage(channel.id, [
    `## ${summary.topic}`,
    summary.summShort,
    `### [Jump to beginning](https://discord.com/channels/${channel.guild_id}/${channel.id}/${summary.startId})`,
    "",
    "-# Automated message by Summaries plugin"
  ].join("\n"));
}
const unpatchFlux = patcher.before("dispatch", common.FluxDispatcher, function(param) {
  let [event] = param;
  if (event.type !== "CONVERSATION_SUMMARY_UPDATE")
    return;
  _vendetta.logger.log("Received CONVERSATION_SUMMARY_UPDATE dispatch: ", event);
  const summaries = event.summaries?.map?.(function(apiSummary) {
    return {
      id: apiSummary.id,
      topic: apiSummary.topic,
      summShort: apiSummary.summ_short,
      startId: apiSummary.start_id,
      endId: apiSummary.end_id
    };
  });
  if (summaries)
    checkSummaries([
      [
        event.channel_id,
        summaries
      ]
    ]);
});
checkSummaries(Object.entries(allSummaries()));
const unpatch = unpatchFlux;
const settings = Settings;exports.settings=settings;exports.unpatch=unpatch;return exports;})({},vendetta,vendetta.patcher,vendetta.metro,vendetta.metro.common,vendetta.plugin,vendetta.ui.toasts,vendetta.storage,vendetta.ui.components);