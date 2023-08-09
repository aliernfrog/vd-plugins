import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const { ChatListAnimationExperiment } = findByProps("ChatListAnimationExperiment");

export default function () {
  const config = ChatListAnimationExperiment.getCurrentConfig();
  
  config.shouldAnimateAndroid = storage.ChatAnimations;
  
  return function () {
    config.shouldAnimateAndroid = false;
  }
}