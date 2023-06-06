import { findByName } from "@vendetta/metro";
import { url } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { Forms } from "@vendetta/ui/components";

const { FormRow } = Forms;
const Icon = findByName("Icon");

export default function JumpStarterSection(actions, firstMessageURL) {
  const ActionsSection = actions[0].type;

  return <ActionsSection key="jumpstartervd">
    <FormRow
      leading={<Icon source={getAssetIDByName("ic_link_24px")} />}
      label={"Jump To Starter Message"}
      onPress={() =>
        (url.openDeeplink(firstMessageURL))
      }
    />
  </ActionsSection>
}