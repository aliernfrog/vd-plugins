import { clipboard, url } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import { General } from "@vendetta/ui/components";

const { TouchableOpacity } = General;
const LinkIcon = getAssetIDByName("toast_copy_link");

export default function JumpReferenceButton(ButtonRow, referenceURL, onClose) {
  return <TouchableOpacity
    onPress={() => {
      url.openDeeplink(referenceURL);
      // app automatically closes the sheet when a link opens, so no need to call onClose here
    }}
    onLongPress={() => {
      clipboard.setString(referenceURL);
      showToast("Copied referenced message URL to clipboard", LinkIcon);
      onClose();
    }}
  >
    <ButtonRow
      message={"Jump To Reference"}
      // TODO icon doesnt show on tabs v1
      iconSource={getAssetIDByName("ic_link_24px")}
    />
  </TouchableOpacity>
}