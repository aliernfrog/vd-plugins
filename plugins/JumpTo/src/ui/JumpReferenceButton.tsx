import { findByName } from "@vendetta/metro";
import { clipboard, url } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import { Forms } from "@vendetta/ui/components";

const { FormRow } = Forms;
const Icon = findByName("Icon");
const LinkIcon = getAssetIDByName("toast_copy_link");

export default function JumpReferenceButton(referenceURL, onClose) {
  return <FormRow
    label={"Jump To Reference"}
    leading={<Icon source={getAssetIDByName("ic_link_24px")} />}
    onPress={() => {
      url.openDeeplink(referenceURL);
      // calling onClose here is not required
    }}
    onLongPress={() => {
      clipboard.setString(referenceURL);
      showToast("Copied referenced message URL to clipboard", LinkIcon);
      onClose();
    }}
  />
}