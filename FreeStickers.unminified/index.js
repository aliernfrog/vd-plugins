(function(exports,metro,patcher,plugin,toasts,_vendetta,alerts,storage,components){'use strict';const NitroModule = metro.findByProps("canUseAnimatedEmojis");
const OLD_CHECK_NAME = "canUseStickersEverywhere";
const NEW_CHECK_NAME = "canUseCustomStickersEverywhere";
const CHECK_NAME = NitroModule[NEW_CHECK_NAME] ? NEW_CHECK_NAME : OLD_CHECK_NAME;
function nitroPatch() {
  return patcher.instead(CHECK_NAME, NitroModule, function() {
    return true;
  });
}const { getChannel } = metro.findByStoreName("ChannelStore");
const baseStickerURL = "https://media.discordapp.net/stickers/{stickerId}.{format}?size={size}";
function isStickerAvailable(sticker, channelId) {
  if (!sticker.guild_id)
    return true;
  const channelGuildId = getChannel(channelId).guild_id;
  return sticker.guild_id == channelGuildId;
}
function buildStickerURL(sticker) {
  const format = sticker.format_type === 4 ? "gif" : "png";
  return baseStickerURL.replace("{stickerId}", sticker.id).replace("{format}", format).replace("{size}", plugin.storage.stickerSize.toString());
}
async function convertToGIF(stickerUrl) {
  try {
    let form = new FormData();
    form.append("new-image-url", stickerUrl);
    let response = await fetch(`https://ezgif.com/apng-to-gif`, {
      method: "POST",
      body: form
    });
    const fileId = response.url.split("/").pop().replace(/\.html$/, "");
    form = new FormData();
    form.append("file", fileId);
    form.append("size", plugin.storage.stickerSize.toString());
    response = await fetch(`https://ezgif.com/apng-to-gif/${fileId}.html?ajax=true`, {
      method: "POST",
      body: form
    });
    const content = await response.text();
    return `https:${content.split('<img src="')[1].split('" style=')[0]}`;
  } catch (e) {
    _vendetta.logger.error(`Failed to convert ${stickerUrl} to GIF: `, e);
    return null;
  }
}const EXPIRE_AFTER_MS = 30 * 60 * 1e3;
const cache = /* @__PURE__ */ new Map();
function set(key, url) {
  cache.set(key, url);
  setTimeout(function() {
    return cache.delete(key);
  }, EXPIRE_AFTER_MS);
}
function get(key) {
  return cache.get(key);
}const { openAlert } = metro.findByProps("openAlert", "dismissAlert");
const { AlertModal, AlertActionButton } = metro.findByProps("AlertModal", "AlertActions");
const { Stack: Stack$1, TextInput } = metro.findByProps("Stack");
function showDialog(options) {
  if (AlertModal && AlertActionButton)
    showNewDialog(options);
  else
    alerts.showConfirmationAlert(options);
}
function showNewDialog({ title, content, placeholder, confirmText, cancelText, onConfirm }) {
  openAlert(generateDialogKey(title), /* @__PURE__ */ React.createElement(AlertModal, {
    title,
    content,
    actions: /* @__PURE__ */ React.createElement(Stack$1, null, /* @__PURE__ */ React.createElement(AlertActionButton, {
      text: confirmText,
      variant: "primary",
      onPress: onConfirm
    }), cancelText ? /* @__PURE__ */ React.createElement(AlertActionButton, {
      text: cancelText,
      variant: "secondary"
    }) : /* @__PURE__ */ React.createElement(React.Fragment, null))
  }));
}
function generateDialogKey(title) {
  return `vdarnfg-${title?.toLowerCase?.().replaceAll?.(" ", "-")}`;
}function showApngAlert(onConfirm) {
  showDialog({
    title: "APNG Sticker",
    content: "This sticker will be converted to a GIF using Ezgif and an Ezgif link will be sent in chat.\nDo you want to continue?",
    confirmText: "Continue",
    cancelText: "Cancel",
    onConfirm
  });
}function showApngFail(staticApngOnFail) {
  showDialog({
    title: "APNG conversion failed",
    content: [
      (staticApngOnFail ? "Instead of an animated GIF, raw APNG sticker will be sent in chat" : "No stickers will be sent in chat") + ", you can customize this behavior in plugin settings.",
      "",
      "Check debug logs for more information about the error."
    ].join("\n"),
    confirmText: "OK"
  });
}const MessageModule = metro.findByProps("sendMessage", "receiveMessage");
const { getStickerById } = metro.findByStoreName("StickersStore");
const { getCurrentUser } = metro.findByStoreName("UserStore");
function messagePatch() {
  return patcher.instead("sendStickers", MessageModule, function(args, orig) {
    if (!plugin.storage.ignoreNitro && getCurrentUser?.().premiumType !== null)
      return orig(...args);
    const [channelId, stickerIds, _, extra] = args;
    const stickers = stickerIds.map(function(stickerId) {
      return getStickerById(stickerId);
    });
    const toModify = stickers.filter(function(s) {
      return !isStickerAvailable(s, channelId);
    });
    if (!toModify.length)
      return orig(...args);
    const sendStickers = async function(ackedApng) {
      if (ackedApng)
        plugin.storage.ackedApng = true;
      for (const sticker of toModify) {
        let stickerURL = buildStickerURL(sticker);
        if (sticker.format_type === 2 && plugin.storage.convertApng) {
          let cached = get(stickerURL);
          if (!cached) {
            toasts.showToast("Converting APNG sticker to GIF..");
            const gif = await convertToGIF(stickerURL);
            if (!gif) {
              showApngFail(plugin.storage.staticApngOnFail);
              if (!plugin.storage.staticApngOnFail)
                continue;
            } else
              set(stickerURL, gif);
            cached = gif;
          }
          stickerURL = cached ?? stickerURL;
        }
        if (plugin.storage.hyperlink && sticker.name)
          stickerURL = `[${sticker.name}](${stickerURL})`;
        MessageModule.sendMessage(channelId, {
          content: stickerURL
        }, null, extra);
      }
    };
    const showApngConfirmation = toModify.find(function(s) {
      return s.format_type == 2;
    }) && !plugin.storage.ackedApng;
    if (showApngConfirmation)
      showApngAlert(function() {
        return sendStickers(true);
      });
    else
      sendStickers();
  });
}const { Stack, TableRadioGroup, TableRadioRow, TableSwitchRow, TableRowGroup } = metro.findByProps("TableRow", "TableRowGroup");
const { ScrollView } = components.General;
const HelpMessage = metro.findByName("HelpMessage");
const sizes = [
  16,
  32,
  64,
  128,
  160,
  256,
  512,
  1024
];
plugin.storage.convertApng ??= true;
plugin.storage.hyperlink ??= true;
plugin.storage.stickerSize ??= 160;
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
    title: "General"
  }, /* @__PURE__ */ React.createElement(TableSwitchRow, {
    label: "Hyperlink stickers",
    value: plugin.storage.hyperlink,
    onValueChange: function(v) {
      return plugin.storage.hyperlink = v;
    }
  }), /* @__PURE__ */ React.createElement(TableSwitchRow, {
    label: "Ignore Nitro",
    subLabel: "Force FreeStickers even when you have Nitro",
    value: plugin.storage.ignoreNitro,
    onValueChange: function(v) {
      return plugin.storage.ignoreNitro = v;
    }
  })), /* @__PURE__ */ React.createElement(TableRowGroup, {
    title: "APNG Stickers"
  }, /* @__PURE__ */ React.createElement(TableSwitchRow, {
    label: "Convert APNG stickers to GIF",
    subLabel: "This is needed for stickers to be animated (uses Ezgif).",
    value: plugin.storage.convertApng,
    onValueChange: function(v) {
      return plugin.storage.convertApng = v;
    }
  }), /* @__PURE__ */ React.createElement(TableSwitchRow, {
    label: "Send static sticker if APNG conversion fails",
    value: plugin.storage.staticApngOnFail,
    onValueChange: function(v) {
      return plugin.storage.staticApngOnFail = v;
    }
  }), /* @__PURE__ */ React.createElement(TableSwitchRow, {
    label: "Show warning dialog for APNG stickers",
    subLabel: "This will only appear once",
    value: !plugin.storage.ackedApng,
    onValueChange: function(v) {
      return plugin.storage.ackedApng = !v;
    }
  })), /* @__PURE__ */ React.createElement(TableRadioGroup, {
    title: "Stickers Size",
    value: plugin.storage.stickerSize.toString(),
    onChange: function(v) {
      return plugin.storage.stickerSize = parseInt(v);
    }
  }, sizes.map(function(size) {
    return /* @__PURE__ */ React.createElement(TableRadioRow, {
      label: size.toString(),
      subLabel: size == 160 ? "Default" : null,
      key: size.toString(),
      value: size.toString()
    });
  })), /* @__PURE__ */ React.createElement(HelpMessage, {
    messageType: 0
  }, "Stickers size option does not work consistently at the moment.")));
}let patches;
const onLoad = function() {
  if (patches)
    onUnload();
  patches = [
    nitroPatch(),
    messagePatch()
  ];
};
const onUnload = function() {
  return patches?.forEach?.(function(unpatch) {
    return unpatch?.();
  });
};
const settings = Settings;exports.onLoad=onLoad;exports.onUnload=onUnload;exports.settings=settings;return exports;})({},vendetta.metro,vendetta.patcher,vendetta.plugin,vendetta.ui.toasts,vendetta,vendetta.ui.alerts,vendetta.storage,vendetta.ui.components);