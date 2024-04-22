import { findByProps } from "@vendetta/metro";
import { clipboard, url } from "@vendetta/metro/common";
import { after, before } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import { findInReactTree } from "@vendetta/utils";
import { buildMessageURL } from "../utils";

const ActionSheet = findByProps("openLazy", "hideActionSheet");
const { ActionSheetRow } = findByProps("ActionSheetRow");
const CopyLinkIcon = getAssetIDByName("ic_copy_message_link");
const ToastLinkIcon = getAssetIDByName("toast_copy_link");

export default before("openLazy", ActionSheet, ([comp, args, msg]) => {
  if (args != "MessageLongPressActionSheet" || !msg?.message) return;
  
  comp.then(instance => {
    const unpatch = after("default", instance, (_, component) => {
      React.useEffect(() => () => { unpatch() }, []);
      const buttons = findInReactTree(component, c => c?.find?.(child => child?.props?.iconSource == CopyLinkIcon));
      const reference = msg?.message?.messageReference;
      if (!reference?.message_id || !buttons?.length) return;
      
      const position = Math.max(buttons.findIndex(c => c?.props?.iconSource === CopyLinkIcon), buttons.length-1);
      const referenceURL = buildMessageURL(reference.guild_id, reference.channel_id, reference.message_id);

      buttons.splice(position, 0, (
        <ActionSheetRow
          label="Jump To Reference"
          icon={
            <ActionSheetRow.Icon
              source={CopyLinkIcon}
            />
          }
          onLongPress={() => {
            clipboard.setString(referenceURL);
            showToast("Copied referenced message URL", ToastLinkIcon);
            ActionSheet.hideActionSheet();
          }}
          onPress={() => {
            url.openDeeplink(referenceURL);
          }}
        />
      ));
    });
  });
});