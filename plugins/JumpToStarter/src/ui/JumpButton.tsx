import { findByName, findByProps } from "@vendetta/metro";
import { url } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { findInReactTree } from "@vendetta/utils";
import { Forms } from "@vendetta/ui/components";

const { FormRow } = Forms;
const Icon = findByName("Icon");

const { hideActionSheet } = findByProps("openLazy", "hideActionSheet");

export default function JumpButton(res, firstMessageURL) {
  const actions = findInReactTree(res, (t) => t.props?.bottom === true).props.children.props.children[1];
  const ActionsSection = actions[0].type;

  actions.unshift(<ActionsSection key="jumpfirst">
    <FormRow
      leading={<Icon source={getAssetIDByName("ic_link_24px")} />}
      label={"Jump to first message"}
      onPress={() =>
        (hideActionSheet())
        (url.openDeeplink(firstMessageURL))
      }
    />
  </ActionsSection>);
}