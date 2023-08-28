import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const { ChatListAnimationExperiment } = findByProps("ChatListAnimationExperiment");

export default function () {
  // TODO this crashes on 194.7
  try {
    const config = ChatListAnimationExperiment.getCurrentConfig();
  
    config.shouldAnimateAndroid = storage.ChatAnimations;
  
    return () => {
      config.shouldAnimateAndroid = false;
    }
  } catch () {
    return () => {}
  }
}