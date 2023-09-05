import { findByProps } from "@vendetta/metro";
import { clipboard, url } from "@vendetta/metro/common";
import { after, before } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { General } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";
import { findInReactTree } from "@vendetta/utils";
import { buildMessageURL } from "../utils";

const { TouchableOpacity } = General;
const ActionSheet = findByProps("openLazy", "hideActionSheet");
const CopyIcon = getAssetIDByName("ic_copy_message_link");
const LinkIcon = getAssetIDByName("toast_copy_link");

export default before("openLazy", ActionSheet, ([comp, args, msg]) => {
  if (args != "MessageLongPressActionSheet") return;
  
  comp.then(instance => {
    const unpatch = after("default", instance, (_, component) => {
      React.useEffect(() => () => { unpatch() }, []);
      let ButtonRow;
      let IconComponent;

      const buttons = findInReactTree(component, (c) => {
        const child = c?.find?.(child =>
          child.props?.iconSource === CopyIcon
        ) ?? c?.find?.(child =>
          child.type?.name === "ButtonRow" && child.props?.IconComponent
        );
        if (!child) return false;
        ButtonRow = child.type;
        IconComponent = child.props.IconComponent;
        return true;
      });

      const reference = msg?.message?.messageReference;
      
      if (!reference?.message_id || !buttons) return;
      
      const referenceURL = buildMessageURL(reference.guild_id, reference.channel_id, reference.message_id);

      buttons.push(
        <TouchableOpacity
          onLongPress={() => {
            clipboard.setString(referenceURL);
            showToast("Copied referenced message URL", LinkIcon);
            ActionSheet.hideActionSheet();
          }}
          onPress={() => {
            url.openDeeplink(referenceURL);
          }}
        >
          <ButtonRow
            message={"Jump To Reference"}
            iconSource={CopyIcon}
            IconComponent={IconComponent}
          />
        </TouchableOpacity>
      );
    });
  });
});