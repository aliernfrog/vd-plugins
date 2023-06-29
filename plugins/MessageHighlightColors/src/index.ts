import { logger } from "@vendetta";
import { findByName, findByProps } from "@vendetta/metro";
import { ReactNative } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import Settings from "./ui/Settings";

const ChatInput = findByName("ChatInput");
const RowManager = findByName("RowManager");

let replyingMessage;

const patches = [
  after("generate", RowManager.prototype, ([data], component) => {
    if (data.rowType !== 1) return;

    let gutterColor;
    let bgColor;
    
    if (replyingMessage == data.message?.id) {
      gutterColor = storage.replyBarColor;
      bgColor = storage.replyBgColor;
    }
    else if (data.isEditing) {
      gutterColor = storage.editBarColor;
      bgColor = storage.editBgColor;
    }

    try {
      if (validateColor(gutterColor))
        component.backgroundHighlight.gutterColor = ReactNative.processColor(gutterColor);
      if (validateColor(bgColor))
        component.backgroundHighlight.backgroundColor = ReactNative.processColor(bgColor);
    } catch (e) {
      logger.error(`Failed to set highlight colors for message ${data.message?.id}`);
    }
  }),

  // I don't know if there's a better way to get pendingReply
  after("render", ChatInput.prototype, (...args) => {
    replyingMessage = args[1].props.children[1]?.props?.pendingReply?.message?.id;
  })
];

export const onUnload = () => patches.forEach(p => p());
export const settings = Settings;

function validateColor(str) {
  if (!str?.startsWith("#") || str?.length < 7) return null;
  return str;
}