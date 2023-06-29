import { findByName, findByProps } from "@vendetta/metro";
import { ReactNative } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

const ChatInput = findByName("ChatInput");
const RowManager = findByName("RowManager");

let highlightedMessage;

storage.barColor ??= "#45458b";

const patches = [
  after("generate", RowManager.prototype, ([data], row) => {
    if (data.rowType !== 1) return;
    if (highlightedMessage == data.message?.id || data.isEditing) {
      row.backgroundHighlight.gutterColor = ReactNative.processColor(storage.barColor);
    }
  }),

  after("render", ChatInput.prototype, (...args) => {
    highlightedMessage = args[1].props.children[1]?.props?.pendingReply?.message?.id;
  })
];

export const onUnload = () => patches.forEach(p => p());