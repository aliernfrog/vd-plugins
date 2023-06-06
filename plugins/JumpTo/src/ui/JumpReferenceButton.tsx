import { findByName } from "@vendetta/metro";
import { url } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { Forms } from "@vendetta/ui/components";

const { FormRow } = Forms;
const Icon = findByName("Icon")

export default function JumpReferenceButton(referenceURL) {
  return <FormRow
    label={"Jump To Reference"}
    leading={<Icon source={getAssetIDByName("ic_link_24px")} />}
    onPress={() =>
      (url.openDeeplink(referenceURL))
    }
  />
}