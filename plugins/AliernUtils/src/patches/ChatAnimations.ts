import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";

const { ChatListAnimationExperiment } = findByProps("ChatListAnimationExperiment");

export default function () {
  if (!storage.ChatAnimations) return;

  const config = ChatListAnimationExperiment.getCurrentConfig();
  const originalValue = config.shouldAnimateAndroid;
  if (originalValue) return; // Chat animations already enabled
  
  config.shouldAnimateAndroid = true;
  
  return function () {
    config.shouldAnimateAndroid = originalValue;
  }
}