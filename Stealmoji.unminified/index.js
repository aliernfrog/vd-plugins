(function(exports,common,patcher,components,metro,assets,toasts,alerts,utils){'use strict';const Surrogates = metro.findByProps("convertSurrogateToName");
const LazyActionSheet = metro.findByProps("hideActionSheet");
const MediaModalUtils = metro.findByProps("openMediaModal");
const Emojis = metro.findByProps("uploadEmoji");
const ActionSheet = metro.findByProps("ActionSheet")?.ActionSheet ?? metro.find(function(m) {
  return m.render?.name === "ActionSheet";
});
const { ActionSheetTitleHeader, ActionSheetCloseButton } = metro.findByProps("ActionSheetTitleHeader");
const { BottomSheetFlatList } = metro.findByProps("BottomSheetScrollView");
const EmojiStore = metro.findByStoreName("EmojiStore");
const GuildStore = metro.findByStoreName("GuildStore");
const PermissionsStore = metro.findByStoreName("PermissionStore");
const { default: GuildIcon, GuildIconSizes } = metro.findByProps("GuildIconSizes");
const { downloadMediaAsset } = metro.findByProps("downloadMediaAsset");function getSizeAsync(src) {
  return new Promise(function(resolve, reject) {
    common.ReactNative.Image.getSize(src, function(width, height) {
      resolve([
        width,
        height
      ]);
    }, reject);
  });
}
async function openMediaModal(src) {
  const [width, height] = await getSizeAsync(src);
  const { width: screenWidth, height: screenHeight } = common.ReactNative.Dimensions.get("window");
  LazyActionSheet.hideActionSheet();
  MediaModalUtils.openMediaModal({
    initialSources: [
      {
        uri: src,
        sourceURI: src,
        width,
        height
      }
    ],
    initialIndex: 0,
    originLayout: {
      width: 128,
      height: 128,
      x: screenWidth / 2 - 64,
      y: screenHeight - 64,
      resizeMode: "fill"
    }
  });
}function fetchImageAsDataURL(url, callback) {
  fetch(url).then(function(resp) {
    resp.blob().then(function(blob) {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        callback(reader.result);
      };
    });
  });
}const { openAlert } = metro.findByProps("openAlert", "dismissAlert");
const { AlertModal, AlertActionButton } = metro.findByProps("AlertModal", "AlertActions");
const { Stack, TextInput } = metro.findByProps("Stack");
function showInputDialog(options) {
  if (AlertModal && AlertActionButton)
    showNewInputDialog(options);
  else
    alerts.showInputAlert(options);
}
function showNewInputDialog(options) {
  const key = generateDialogKey(options.title);
  openAlert(generateDialogKey(options.title), /* @__PURE__ */ React.createElement(NewInputDialog, {
    key,
    title: options.title,
    content: options.content,
    initialValue: options.initialValue,
    placeholder: options.placeholder,
    onConfirm: options.onConfirm,
    confirmText: options.confirmText,
    cancelText: options.cancelText,
    allowEmpty: options.allowEmpty
  }));
}
function NewInputDialog({ key, title, content, initialValue, placeholder, onConfirm, confirmText, cancelText, allowEmpty }) {
  const [value, setValue] = React.useState(initialValue ?? "");
  function loadConfirm() {
    if (!allowEmpty && !value.trim().length)
      return toasts.showToast("Cannot add with a blank name");
    onConfirm(value);
  }
  return /* @__PURE__ */ React.createElement(AlertModal, {
    title,
    content,
    extraContent: /* @__PURE__ */ React.createElement(TextInput, {
      isClearable: true,
      value,
      onChange: setValue,
      placeholder,
      returnKeyType: "done",
      onSubmitEditing: loadConfirm
    }),
    actions: /* @__PURE__ */ React.createElement(Stack, null, /* @__PURE__ */ React.createElement(AlertActionButton, {
      disabled: !value.trim().length,
      text: confirmText,
      variant: "primary",
      onPress: loadConfirm
    }), cancelText ? /* @__PURE__ */ React.createElement(AlertActionButton, {
      text: cancelText,
      variant: "secondary"
    }) : /* @__PURE__ */ React.createElement(React.Fragment, null))
  });
}
function generateDialogKey(title) {
  return `vdarnfg-${title?.toLowerCase?.().replaceAll?.(" ", "-")}`;
}const emojiSlotModule = metro.findByProps("getMaxEmojiSlots");
const { FormRow, FormIcon: FormIcon$1 } = components.Forms;
function AddToServerRow({ guild, emojiNode }) {
  const addToServerCallback = function() {
    showInputDialog({
      title: "Emoji name",
      initialValue: emojiNode.alt,
      placeholder: "bleh",
      onConfirm: async function(name) {
        fetchImageAsDataURL(emojiNode.src, function(dataUrl) {
          Emojis.uploadEmoji({
            guildId: guild.id,
            image: dataUrl,
            name,
            roles: void 0
          }).then(function() {
            toasts.showToast(`Added ${emojiNode.alt} ${emojiNode.alt !== name ? `as ${name} ` : ""}to ${guild.name}`, assets.getAssetIDByName("Check"));
          }).catch(function(e) {
            toasts.showToast(e.body.message, assets.getAssetIDByName("Small"));
          });
        });
      },
      confirmText: `Add to ${guild.name}`,
      confirmColor: void 0,
      cancelText: "Cancel"
    });
    LazyActionSheet.hideActionSheet();
  };
  let isSlotsUnknown = false;
  const slotsAvailable = common.React.useMemo(function() {
    let maxSlots = guild.getMaxEmojiSlots?.() ?? emojiSlotModule?.getMaxEmojiSlots?.(guild);
    if (!maxSlots) {
      if (!isSlotsUnknown) {
        isSlotsUnknown = true;
        toasts.showToast("Failed to check max emoji slots");
      }
      maxSlots = 250;
    }
    const guildEmojis = EmojiStore.getGuilds()[guild.id]?.emojis ?? [];
    const isAnimated = emojiNode.src.includes(".gif");
    return guildEmojis.filter(function(e) {
      return e?.animated === isAnimated;
    }).length < maxSlots;
  }, []);
  return /* @__PURE__ */ common.React.createElement(FormRow, {
    leading: /* @__PURE__ */ common.React.createElement(GuildIcon, {
      guild,
      size: GuildIconSizes.MEDIUM,
      animate: false
    }),
    disabled: !slotsAvailable,
    label: guild.name,
    subLabel: !slotsAvailable ? "No slots available" : isSlotsUnknown ? "Failed to check max emoji slots" : void 0,
    trailing: /* @__PURE__ */ common.React.createElement(FormIcon$1, {
      style: {
        opacity: 1
      },
      source: assets.getAssetIDByName("ic_add_24px")
    }),
    onPress: addToServerCallback
  });
}const { FormDivider, FormIcon } = components.Forms;
function showAddToServerActionSheet(emojiNode) {
  const element = /* @__PURE__ */ React.createElement(ActionSheet, {
    scrollable: true
  }, /* @__PURE__ */ React.createElement(components.ErrorBoundary, null, /* @__PURE__ */ React.createElement(AddToServer, {
    emojiNode
  })));
  LazyActionSheet.openLazy(Promise.resolve({
    default: function() {
      return element;
    }
  }), "AddToServerActionSheet");
}
function AddToServer({ emojiNode }) {
  const guilds = Object.values(GuildStore.getGuilds()).filter(function(guild) {
    return PermissionsStore.can(common.constants.Permissions.MANAGE_GUILD_EXPRESSIONS, guild);
  }).sort(function(a, b) {
    return a.name?.localeCompare?.(b.name);
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ActionSheetTitleHeader, {
    title: `Stealing ${emojiNode.alt}`,
    leading: /* @__PURE__ */ React.createElement(FormIcon, {
      style: {
        marginRight: 12,
        opacity: 1
      },
      source: {
        uri: emojiNode.src
      },
      disableColor: true
      // It actually does the opposite
    }),
    trailing: /* @__PURE__ */ React.createElement(ActionSheetCloseButton, {
      onPress: function() {
        return LazyActionSheet.hideActionSheet();
      }
    })
  }), /* @__PURE__ */ React.createElement(BottomSheetFlatList, {
    style: {
      flex: 1
    },
    contentContainerStyle: {
      paddingBottom: 24
    },
    data: guilds,
    renderItem: function({ item }) {
      return /* @__PURE__ */ React.createElement(AddToServerRow, {
        guild: item,
        emojiNode
      });
    },
    ItemSeparatorComponent: FormDivider,
    keyExtractor: function(x) {
      return x.id;
    }
  }));
}const { Button } = metro.findByProps("TableRow", "Button");
function StealButtons({ emojiNode }) {
  const buttons = [
    {
      text: "Add to Server",
      callback: function() {
        return showAddToServerActionSheet(emojiNode);
      }
    },
    {
      text: "Copy URL to clipboard",
      callback: function() {
        common.clipboard.setString(emojiNode.src);
        LazyActionSheet.hideActionSheet();
        toasts.showToast(`Copied ${emojiNode.alt}'s URL to clipboard`, assets.getAssetIDByName("ic_copy_message_link"));
      }
    },
    ...common.ReactNative.Platform.select({
      ios: [
        {
          text: "Copy image to clipboard",
          callback: function() {
            return fetchImageAsDataURL(emojiNode.src, function(dataUrl) {
              common.clipboard.setImage(dataUrl.split(",")[1]);
              LazyActionSheet.hideActionSheet();
              toasts.showToast(`Copied ${emojiNode.alt}'s image to clipboard`, assets.getAssetIDByName("ic_message_copy"));
            });
          }
        }
      ],
      default: []
    }),
    {
      text: `Save image to ${common.ReactNative.Platform.select({
        android: "Downloads",
        default: "Camera Roll"
      })}`,
      callback: function() {
        downloadMediaAsset(emojiNode.src, !emojiNode.src.includes(".gif") ? 0 : 1);
        LazyActionSheet.hideActionSheet();
        toasts.showToast(`Saved ${emojiNode.alt}'s image to ${common.ReactNative.Platform.select({
          android: "Downloads",
          default: "Camera Roll"
        })}`, assets.getAssetIDByName("toast_image_saved"));
      }
    }
  ];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, buttons.map(function({ text, callback }) {
    return /* @__PURE__ */ React.createElement(Button, {
      color: Button.Colors?.BRAND,
      text,
      size: Button.Sizes?.SMALL,
      onPress: callback,
      style: {
        marginTop: common.ReactNative.Platform.select({
          android: 12,
          default: 16
        })
      }
    });
  }));
}const { TouchableOpacity: TouchableOpacity$1 } = components.General;
const MessageEmojiActionSheet = metro.findByProps("GuildDetails");
function patchMessageEmojiActionSheet() {
  if (MessageEmojiActionSheet)
    return patchSheet("default", MessageEmojiActionSheet);
  const patches = [];
  const unpatchLazy = patcher.before("openLazy", LazyActionSheet, function([lazySheet, name]) {
    if (name !== "MessageEmojiActionSheet")
      return;
    unpatchLazy();
    lazySheet.then(function(module) {
      patches.push(patcher.after("default", module, function(_, res) {
        patches.push(patchSheet("type", res, true));
      }));
    });
  });
  return function() {
    return unpatchLazy(), patches.forEach(function(p) {
      return p?.();
    });
  };
}
function patchSheet(funcName, sheetModule, once = false) {
  const unpatch = patcher.after(funcName, sheetModule, function([{ emojiNode }], res) {
    common.React.useEffect(function() {
      return function() {
        return void (once && unpatch());
      };
    }, []);
    if (!emojiNode.src)
      return;
    const view = res?.props?.children?.props?.children;
    if (!view)
      return;
    const unpatchView = patcher.after("type", view, function(_, component) {
      common.React.useEffect(function() {
        return unpatchView;
      }, []);
      const isIconComponent = function(c) {
        return c?.props?.source?.uri;
      };
      const iconContainer = utils.findInReactTree(component, function(c) {
        return c?.find?.(isIconComponent);
      });
      const iconComponentIndex = iconContainer?.findIndex?.(isIconComponent) ?? -1;
      if (iconComponentIndex >= 0) {
        iconContainer[iconComponentIndex] = /* @__PURE__ */ common.React.createElement(TouchableOpacity$1, {
          onPress: function() {
            return openMediaModal(emojiNode.src.split("?")[0]);
          }
        }, iconContainer[iconComponentIndex]);
      }
      const isButton = function(c) {
        return c?.type?.name === "Button";
      };
      const buttonsContainer = utils.findInReactTree(component, function(c) {
        return c?.find?.(isButton);
      });
      const buttonIndex = buttonsContainer?.findLastIndex?.(isButton) ?? -1;
      if (buttonIndex >= 0) {
        buttonsContainer.splice(buttonIndex + 1, 0, /* @__PURE__ */ common.React.createElement(StealButtons, {
          emojiNode
        }));
      } else {
        component?.props?.children?.push?.(/* @__PURE__ */ common.React.createElement(StealButtons, {
          emojiNode
        }));
      }
    });
  });
  return unpatch;
}function lazy(factory) {
  let cache;
  return function() {
    return cache ??= factory();
  };
}const getTapEmojiHandler = lazy(function() {
  const { MessagesHandlers } = metro.findByProps("MessagesHandlers");
  const instance = new MessagesHandlers(function() {
  });
  instance.isModalOrActionsheetObstructing = function() {
    return LazyActionSheet.hideActionSheet();
  };
  return function(emojiNode) {
    return instance.handleTapEmoji({
      nativeEvent: {
        node: emojiNode
      }
    });
  };
});
function openEmojiActionSheet({ id, name, animated }) {
  try {
    getTapEmojiHandler()(id ? {
      id,
      alt: name,
      src: `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "webp"}?size=128`
    } : {
      content: Surrogates.convertSurrogateToName(name),
      surrogate: name
    });
  } catch (err) {
    console.log("Failed to open action sheet", err);
  }
}const { TouchableOpacity } = components.General;
function patchActionSheet() {
  return patcher.before("openLazy", LazyActionSheet, function([lazySheet, name]) {
    if (name != "MessageReactions")
      return;
    lazySheet.then(function(module) {
      const unpatchSheet = patcher.after("default", module, function(_, sheet) {
        common.React.useEffect(function() {
          return unpatchSheet;
        }, []);
        const unpatchView = patcher.after("type", sheet?.props?.children, function(_2, view) {
          common.React.useEffect(function() {
            return unpatchView;
          }, []);
          const unpatchHeader = patcher.after("type", view?.props?.header, function(_3, header) {
            common.React.useEffect(function() {
              return unpatchHeader;
            }, []);
            const row = utils.findInReactTree(header, function(c) {
              return c?.props?.tabs?.length;
            });
            if (!row)
              return;
            const { tabs, onSelect } = row.props;
            row.props.tabs = tabs.map(function(tab) {
              return /* @__PURE__ */ common.React.createElement(TouchableOpacity, {
                onPress: function() {
                  return onSelect(tab.props.index);
                },
                onLongPress: function() {
                  const { emoji } = tab.props.reaction;
                  openEmojiActionSheet(emoji);
                }
              }, tab);
            });
          });
        });
      });
    });
  });
}let patches = [];
var index = {
  onLoad: function() {
    patches.push(patchMessageEmojiActionSheet());
    patches.push(patchActionSheet());
  },
  onUnload: function() {
    for (const unpatch of patches) {
      unpatch();
    }
  }
};exports.default=index;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({},vendetta.metro.common,vendetta.patcher,vendetta.ui.components,vendetta.metro,vendetta.ui.assets,vendetta.ui.toasts,vendetta.ui.alerts,vendetta.utils);