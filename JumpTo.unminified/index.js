(function(exports,metro,common,patcher,assets,toasts,utils){'use strict';const { openUrl } = metro.findByProps("openUrl");
function openURL(url) {
  if (openUrl)
    openUrl(url);
  else
    url?.openURL?.(url);
}
function buildMessageURL(guild, channel, message) {
  return `https://discord.com/channels/${guild ?? "@me"}/${channel}/${message}`;
}
function buildStarterURL(thread) {
  return buildMessageURL(thread.guild_id, thread.id, thread.id);
}const { hideActionSheet } = metro.findByProps("openLazy", "hideActionSheet");
const { ActionSheetRow: ActionSheetRow$1 } = metro.findByProps("ActionSheetRow");
const ForumPostLongPressActionSheet = metro.findByName("ForumPostLongPressActionSheet", false);
const CopyLinkIcon$1 = assets.getAssetIDByName("LinkIcon") ?? assets.getAssetIDByName("ic_copy_message_link");
const ToastLinkIcon$1 = assets.getAssetIDByName("toast_copy_link");
var ForumPostActionSheet = patcher.after("default", ForumPostLongPressActionSheet, function(param, component) {
  let [{ thread }] = param;
  const actions = utils.findInReactTree(component, function(c) {
    return c?.[0]?.type?.name === "ActionSheetRowGroup";
  });
  if (!actions)
    return;
  const starterURL = buildStarterURL(thread);
  actions.unshift(/* @__PURE__ */ React.createElement(ActionSheetRow$1.Group, {
    key: "jumptovd"
  }, /* @__PURE__ */ React.createElement(ActionSheetRow$1, {
    label: "Jump To Starter Message",
    icon: /* @__PURE__ */ React.createElement(ActionSheetRow$1.Icon, {
      source: CopyLinkIcon$1
    }),
    onPress: function() {
      openURL(starterURL);
    },
    onLongPress: function() {
      common.clipboard.setString(starterURL);
      toasts.showToast("Copied starter message URL", ToastLinkIcon$1);
      hideActionSheet();
    }
  })));
});const ActionSheet = metro.findByProps("openLazy", "hideActionSheet");
const { ActionSheetRow } = metro.findByProps("ActionSheetRow");
const CopyLinkIcon = assets.getAssetIDByName("LinkIcon") ?? assets.getAssetIDByName("ic_copy_message_link");
const ToastLinkIcon = assets.getAssetIDByName("toast_copy_link");
var MessageActionSheet = patcher.before("openLazy", ActionSheet, function(param) {
  let [comp, args, msg] = param;
  if (args != "MessageLongPressActionSheet" || !msg?.message)
    return;
  comp.then(function(instance) {
    const unpatch = patcher.after("default", instance, function(_, component) {
      React.useEffect(function() {
        return function() {
          unpatch();
        };
      }, []);
      const reference = msg?.message?.messageReference;
      if (!reference?.message_id)
        return;
      let buttons = utils.findInReactTree(component, function(c) {
        return c?.some?.(function(child) {
          return child?.props?.iconSource == CopyLinkIcon;
        });
      });
      if (!buttons?.length) {
        const groups = utils.findInReactTree(component, function(c) {
          return c?.[0]?.type?.name === "ActionSheetRowGroup";
        });
        const targetGroupIndex = Math.min(1, groups.length - 1);
        buttons = utils.findInReactTree(groups[targetGroupIndex], function(c) {
          return c?.some?.(function(child) {
            return child?.type?.name === "ActionSheetRow";
          });
        });
      }
      if (!buttons?.length)
        return;
      const position = Math.max(buttons.findIndex(function(c) {
        return c?.props?.iconSource === CopyLinkIcon;
      }), buttons.length - 1);
      const referenceURL = buildMessageURL(reference.guild_id, reference.channel_id, reference.message_id);
      buttons.splice(position, 0, /* @__PURE__ */ React.createElement(ActionSheetRow, {
        label: "Jump To Reference",
        icon: /* @__PURE__ */ React.createElement(ActionSheetRow.Icon, {
          source: CopyLinkIcon
        }),
        onLongPress: function() {
          common.clipboard.setString(referenceURL);
          toasts.showToast("Copied referenced message URL", ToastLinkIcon);
          ActionSheet.hideActionSheet();
        },
        onPress: function() {
          openURL(referenceURL);
        }
      }));
    });
  });
});const patches = [
  ForumPostActionSheet,
  MessageActionSheet
];
const onUnload = function() {
  return patches.forEach(function(p) {
    return p?.();
  });
};exports.onUnload=onUnload;return exports;})({},vendetta.metro,vendetta.metro.common,vendetta.patcher,vendetta.ui.assets,vendetta.ui.toasts,vendetta.utils);