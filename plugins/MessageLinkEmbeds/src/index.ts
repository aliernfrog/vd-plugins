import { findByName, findByProps, findByStoreName } from "@vendetta/metro";
import { FluxDispatcher, ReactNative } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { semanticColors } from "@vendetta/ui";
//import { showToast } from "@vendetta/ui/toasts";

const RowManager = findByName("RowManager");
const RestAPI = findByProps("getAPIBaseURL");
const ThemeStore = findByStoreName("ThemeStore");
const { getChannel } = findByStoreName("ChannelStore");
const { getGuild } = findByStoreName("GuildStore");
const { resolveSemanticColor } = findByProps("colors", "meta").meta;

const messageLinkRegex = /(?<!<)https?:\/\/(?:\w+\.)?discord(?:app)?\.com\/channels\/(\d{17,20}|@me)\/(\d{17,20})\/(\d{17,20})/g;

const messageCache = new Map();

let textColor;
let textColorTheme;

const patch = vendetta.patcher.after("generate", RowManager.prototype, ([data], component) => {
  if (data.rowType !== 1) return; // Not a message
  
  const content = data?.message?.content;
  if (!content) return; // We need content

  const links = content.match?.(messageLinkRegex);
  const messages = links?.map(url => {
    const paths = url.split("/").slice(-3);
    return {
      guildId: (paths[0] == "@me") ? null : paths[0],
      channelId: paths[1],
      messageId: paths[2],
      rawURL: url
    }
  });
  
  component.message.embeds ??= [];
  messages?.forEach(obj => {
    // Awaiting the response makes it impossible to add embeds,
    // so do a fake edit and make it re-generate the row
    if (!messageCache.has(obj.messageId)) return fetchMessage(obj.channelId, obj.messageId)
      .then(() => regenerateMessage(data.message));
    
    const cachedMessage = messageCache.get(obj.messageId);
    if (!cachedMessage) return;

    // Return if rendering content only
    if (component.message.renderContentOnly != false) return;

    /*const images = cachedMessage.attachments
      ?.filter?.(a => a.content_type?.startsWith("image/"))
      ?.map?.(attachment => ({
        url: attachment.url,
        proxyURL: attachment.proxy_url,
        width: attachment.width,
        height: attachment.height
      }));*/
    
    const avatarURL = `https://cdn.discordapp.com/avatars/${cachedMessage.author?.id}/${cachedMessage.author?.avatar}.png`;
    const time = new Date(cachedMessage.timestamp).toLocaleString([], {year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"});
    const guild = !!obj.guildId ? getGuild(obj.guildId) : null;
    const guildName = guild?.name;
    const guildIconURL = guild ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null;
    const channel = getChannel(obj.channelId);
    const channelName = channel?.name;
    const channelInfo = `${channelName ? "#"+channelName : ""}${guildName ? "  •  "+guildName: ""}`;
    const footerText = channelInfo.length ? channelInfo : null;
    component.message.embeds.push({
      type: "rich",
      author: {
        name: `${cachedMessage.author?.global_name ?? cachedMessage.author?.username}  •  ${time}`,
        url: obj.rawURL,
        iconURL: avatarURL,
        iconProxyURL: avatarURL
      },
      rawDescription: cachedMessage.content,
      description: [ { content: cachedMessage.content, type: "text" } ],
      //image: images?.[0],
      //images: images,
      fields: [],
      footer: {
        text: footerText,
        iconURL: guildIconURL,
        iconProxyURL: guildIconURL,
        content: footerText
      },
      bodyTextColor: resolveTextColor()
    });
  });
});

export const onUnload = () => patch();

async function fetchMessage(channelId, messageId) {
  if (messageCache.has(messageId)) return;
  messageCache.set(messageId, null);
  //showToast(`Requesting ${messageId}..`);
  
  const res = await RestAPI.get({
    url: `/channels/${channelId}/messages`,
    query: {
      limit: 1,
      around: messageId
    },
    retries: 2
  }).catch(() => null);

  const message = res?.body?.[0];
  messageCache.set(messageId, message);
  return message;
}

function regenerateMessage(message) {
  FluxDispatcher.dispatch({
    type: "MESSAGE_UPDATE",
    message: {
      ...message,
      content: message.content+"\u200b"
    },
    log_edit: false
  });
}

function resolveTextColor() {
  if (textColorTheme == ThemeStore.theme && textColor) return textColor;
  textColorTheme = ThemeStore.theme;
  textColor = ReactNative.processColor(
    resolveSemanticColor(
      textColorTheme,
      semanticColors.TEXT_NORMAL
    )
  );
  return textColor;
}