import { logger } from "@vendetta";
import { findByName, findByProps } from "@vendetta/metro";
import { url } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { findInReactTree } from "@vendetta/utils";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { Forms } from "@vendetta/ui/components";

const { FormRow } = Forms;
const Icon = findByName("Icon");

const ForumPostLongPressActionSheet = findByName("ForumPostLongPressActionSheet", false);
const { useFirstForumPostMessage } = findByProps("useFirstForumPostMessage");
const { hideActionSheet } = findByProps("openLazy", "hideActionSheet");

let patch;

export default {
  onLoad: () => {
    patch = after("default", ForumPostLongPressActionSheet, ([{ thread }], res) => {
      const { firstMessage } = useFirstForumPostMessage(thread);
      
      if (!firstMessage) return logger.log(`Forum thread ${thread.id} doesn't have a starter message`);
      
      logger.log(`First message: ${JSON.stringify(firstMessage)}`);
      logger.log(`Thread: ${JSON.stringify(thread)}`);
      
      const actions = findInReactTree(res, (t) => t.props?.bottom === true).props.children.props.children[1];
      const ActionsSection = actions[0].type;

      actions.unshift(<ActionsSection>
        <FormRow
          leading={<Icon source={getAssetIDByName("ic_link_24px")} />}
          label={"Jump to first message"}
          onPress={() =>
            url.openDeeplink(`https://discord.com/channels/${thread.guild_id}/${thread.id}/${firstMessage.id}`);
            hideActionSheet();
          }
        />
      </ActionsSection>);
    });
  },
  
  onUnload: () => {
    patch?.unpatch();
  }
}