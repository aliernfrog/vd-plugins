import { findByName, findByProps } from "@vendetta/metro";
import { clipboard } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import { findInReactTree } from "@vendetta/utils";
import { buildStarterURL, openURL } from "../utils";

const { hideActionSheet } = findByProps("openLazy", "hideActionSheet");
const { ActionSheetRow } = findByProps("ActionSheetRow");
const ForumPostLongPressActionSheet = findByName("ForumPostLongPressActionSheet", false);
const CopyLinkIcon = getAssetIDByName("LinkIcon") ?? getAssetIDByName("ic_copy_message_link");
const ToastLinkIcon = getAssetIDByName("toast_copy_link");

export default after("default", ForumPostLongPressActionSheet, ([{thread}], component) => {
  const actions = findInReactTree(component, (c) =>
    c?.[0]?.type?.name === "ActionSheetRowGroup"
  );

  if (!actions) return;

  const starterURL = buildStarterURL(thread);
  
  actions.unshift(
    <ActionSheetRow.Group key="jumptovd">
      <ActionSheetRow
        label="Jump To Starter Message"
        icon={
          <ActionSheetRow.Icon
            source={CopyLinkIcon}
          />
        }
        onPress={() => {
          openURL(starterURL);
        }}
        onLongPress={() => {
          clipboard.setString(starterURL);
          showToast("Copied starter message URL", ToastLinkIcon);
          hideActionSheet();
        }}
      />
    </ActionSheetRow.Group>
  );
});