(function(exports,patcher,metro,utils,common,assets,toasts){'use strict';const ActionSheet = metro.findByProps("openLazy", "hideActionSheet");
const { ActionSheetRow } = metro.findByProps("ActionSheetRow");
const CopyIcon = assets.getAssetIDByName("CopyIcon");
var CommandPopoutSheet = patcher.before("openLazy", ActionSheet, function(param) {
  let [comp, tag] = param;
  if (!tag?.startsWith?.("ExecutedCommandPopout"))
    return;
  comp.then(function(instance) {
    const unpatchSheet = patcher.after("default", instance, function(_, sheet) {
      React.useEffect(function() {
        return unpatchSheet;
      }, []);
      const container = utils.findInReactTree(sheet, function(c) {
        return c?.type?.name === "CommandActionsContainer";
      });
      if (!container)
        return;
      const unpatchContainer = patcher.after("type", container, function(info, containerComp) {
        React.useEffect(function() {
          return unpatchContainer;
        }, []);
        const command = info?.[0]?.data;
        if (!command)
          return;
        const rows = utils.findInReactTree(containerComp, function(t) {
          return t?.[0]?.props?.children?.type?.name === "TableRow";
        });
        if (!rows)
          return;
        rows.unshift(/* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ActionSheetRow, {
          label: "Copy Command Mention",
          onPress: function() {
            const mention = `</${command.name}:${command.id}>`;
            common.clipboard.setString(mention);
            toasts.showToast("Copied command mention to clipboard", CopyIcon);
          }
        })), /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ActionSheetRow, {
          label: "Copy Command ID",
          onPress: function() {
            common.clipboard.setString(command.id);
            toasts.showToast("Copied command ID to clipboard", CopyIcon);
          }
        })));
      });
    });
  });
});const patches = [
  CommandPopoutSheet
];
const onUnload = function() {
  return patches.forEach(function(p) {
    return p?.();
  });
};exports.onUnload=onUnload;return exports;})({},vendetta.patcher,vendetta.metro,vendetta.utils,vendetta.metro.common,vendetta.ui.assets,vendetta.ui.toasts);