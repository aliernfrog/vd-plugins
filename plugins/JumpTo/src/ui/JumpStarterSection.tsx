import { clipboard, url } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import { Forms } from "@vendetta/ui/components";

const { FormIcon, FormRow } = Forms;
const LinkIcon = getAssetIDByName("toast_copy_link");

export default function JumpStarterSection(actions, firstMessageURL, onClose) {
  const ActionsSection = actions[0].type;

  return <ActionsSection key="jumpstartervd">
    <FormRow
      leading={<FormIcon source={getAssetIDByName("ic_link_24px")} />}
      label={"Jump To Starter Message"}
      onPress={() => {
        url.openDeeplink(firstMessageURL);
        // calling onClose here is not required
      }}
      onLongPress={() => {
        clipboard.setString(firstMessageURL);
        showToast("Copied starter message URL to clipboard", LinkIcon);
        onClose();
      }}
    />
  </ActionsSection>
}