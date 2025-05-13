(function(exports,patcher,assets,utils,metro,common,toasts,ui){'use strict';const { createStyles } = metro.findByProps("createStyles");
const { Text, TextInput } = common.ReactNative;
const useStyles = createStyles({
  codeBlock: {
    fontFamily: common.constants.Fonts.CODE_NORMAL,
    fontSize: 12,
    textAlignVertical: "center",
    backgroundColor: ui.semanticColors.BACKGROUND_SECONDARY,
    color: ui.semanticColors.TEXT_NORMAL,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: ui.semanticColors.BACKGROUND_TERTIARY,
    padding: 10
  }
});
const InputBasedCodeblock = function(param) {
  let { style, children } = param;
  return /* @__PURE__ */ React.createElement(TextInput, {
    editable: true,
    multiline: true,
    style: [
      useStyles().codeBlock,
      style && style
    ],
    value: children
  });
};
function Codeblock(param) {
  let { selectable, style, children } = param;
  return /* @__PURE__ */ React.createElement(InputBasedCodeblock, {
    style,
    children
  });
}const cleanMessage = function(msg) {
  const clone = JSON.parse(JSON.stringify(msg));
  for (const key in clone.author) {
    switch (key) {
      case "email":
      case "phone":
      case "mfaEnabled":
      case "hasBouncedEmail":
        delete clone.author[key];
    }
  }
  return clone;
};const { Button } = metro.findByProps("Button", "Stack");
const { ScrollView } = common.ReactNative;
function RawPage(param) {
  let { message } = param;
  const stringMessage = common.React.useMemo(function() {
    return JSON.stringify(cleanMessage(message), null, 4);
  }, [
    message.id
  ]);
  const style = {
    margin: 8
  };
  return /* @__PURE__ */ common.React.createElement(common.React.Fragment, null, /* @__PURE__ */ common.React.createElement(ScrollView, {
    style: {
      flex: 1
    }
  }, /* @__PURE__ */ common.React.createElement(Button, {
    text: "Copy Raw Content",
    style,
    variant: "secondary",
    disabled: !message.content,
    onPress: function() {
      common.clipboard.setString(message.content);
      toasts.showToast("Copied content to clipboard", assets.getAssetIDByName("toast_copy_link"));
    }
  }), /* @__PURE__ */ common.React.createElement(Button, {
    text: "Copy Raw Data",
    style,
    variant: "secondary",
    onPress: function() {
      common.clipboard.setString(stringMessage);
      toasts.showToast("Copied data to clipboard", assets.getAssetIDByName("toast_copy_link"));
    }
  }), message.content && /* @__PURE__ */ common.React.createElement(Codeblock, {
    selectable: true,
    style
  }, message.content), /* @__PURE__ */ common.React.createElement(Codeblock, {
    selectable: true,
    style
  }, stringMessage)));
}const ActionSheet = metro.findByProps("openLazy", "hideActionSheet");
const { ActionSheetRow } = metro.findByProps("ActionSheetRow");
const Navigation = metro.findByProps("push", "pushLazy", "pop");
const modalCloseButton = metro.findByProps("getRenderCloseButton")?.getRenderCloseButton ?? metro.findByProps("getHeaderCloseButton")?.getHeaderCloseButton;
const Navigator = metro.findByName("Navigator") ?? metro.findByProps("Navigator")?.Navigator;
const unpatch = patcher.before("openLazy", ActionSheet, function(param) {
  let [component, key, msg] = param;
  const message = msg?.message;
  if (key !== "MessageLongPressActionSheet" || !message)
    return;
  component.then(function(instance) {
    const unpatch2 = patcher.after("default", instance, function(_, component2) {
      common.React.useEffect(function() {
        return function() {
          unpatch2();
        };
      }, []);
      const buttons = utils.findInReactTree(component2, function(c) {
        return c?.some?.(function(child) {
          return child?.type?.name === "ButtonRow" || child?.type?.name === "ActionSheetRow";
        });
      });
      if (!buttons)
        return;
      const navigator = function() {
        return /* @__PURE__ */ common.React.createElement(Navigator, {
          initialRouteName: "RawPage",
          goBackOnBackPress: true,
          screens: {
            RawPage: {
              title: "ViewRaw",
              headerLeft: modalCloseButton?.(function() {
                return Navigation.pop();
              }),
              render: function() {
                return /* @__PURE__ */ common.React.createElement(RawPage, {
                  message
                });
              }
            }
          }
        });
      };
      buttons.push(/* @__PURE__ */ common.React.createElement(ActionSheetRow, {
        label: "View Raw",
        icon: /* @__PURE__ */ common.React.createElement(ActionSheetRow.Icon, {
          source: assets.getAssetIDByName("ChatIcon")
        }),
        onPress: function() {
          ActionSheet.hideActionSheet();
          Navigation.push(navigator);
        }
      }));
    });
  });
});
const onUnload = function() {
  return unpatch();
};exports.onUnload=onUnload;return exports;})({},vendetta.patcher,vendetta.ui.assets,vendetta.utils,vendetta.metro,vendetta.metro.common,vendetta.ui.toasts,vendetta.ui);