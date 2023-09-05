import ForumPostActionSheet from "./patches/ForumPostActionSheet";
import MessageActionSheet from "./patches/MessageActionSheet";

const patches = [
  ForumPostActionSheet,
  MessageActionSheet
];

export const onUnload = () => patches.forEach(p => p?.());