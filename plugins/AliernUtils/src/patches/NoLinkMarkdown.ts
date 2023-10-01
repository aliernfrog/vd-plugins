/*
This was originally supposed to disable markdown for message links completely,
however, it doesn't.
But this fixes a message rendering issue that is present on recent (alpha?) versions.
This still achieves the goal of fixing message rendering issue, so ill leave it for now.

I was too lazy to rename this patch to FixLinkMarkdown.
*/

import { findByName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

const createMessageContent = findByName("createMessageContent", false);

export default function () {
  if (!storage.NoLinkMarkdown) return;

  return after("default", createMessageContent, (args) => {
    const message = args?.[0]?.message;
    if (!message?.content) return;
    message.content = message.content.replace(/(https?:\/\/discord.com\/channels\/[\w\/]+)/g, "<$1>");
  });
}