import { findByName, findByProps } from "@vendetta/metro";
import { clipboard, url } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
/* Only required for old patch -> */ import { Forms } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";
import { findInReactTree } from "@vendetta/utils";
import { buildStarterURL } from "../utils";

const { hideActionSheet } = findByProps("openLazy", "hideActionSheet");
const ActionSheetRow = findByProps("ActionSheetRow")?.ActionSheetRow;
const ForumPostLongPressActionSheet = findByName("ForumPostLongPressActionSheet", false);
const CopyIcon = getAssetIDByName("ic_copy_message_link");
const LinkIcon = getAssetIDByName("toast_copy_link");

/* Only required for old patch -> */ const { FormIcon, FormRow } = Forms;

const newPatch = () => after("default", ForumPostLongPressActionSheet, ([{thread}], component) => {
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
            source={CopyIcon}
          />
        }
        onPress={() => {
          url.openDeeplink(starterURL);
        }}
        onLongPress={() => {
          clipboard.setString(starterURL);
          showToast("Copied starter message URL", LinkIcon);
          hideActionSheet();
        }}
      />
    </ActionSheetRow.Group>
  );
});

const oldPatch = () => after("default", ForumPostLongPressActionSheet, ([{thread}], component) => {
  const actions = findInReactTree(component, (c) => c?.props?.bottom)?.props?.children?.props?.children?.[1];
  if (!actions) return;

  const starterURL = buildStarterURL(thread);
  const ActionsSection = actions[0].type;
  
  actions.unshift(
    <ActionsSection key="jumptovd">
      <FormRow
        label="Jump To Starter Message"
        leading={
          <FormIcon
            source={CopyIcon}
            style={{ opacity: 1 }}
          />
        }
        onPress={() => {
          url.openDeeplink(starterURL);
        }}
        onLongPress={() => {
          clipboard.setString(starterURL);
          showToast("Copied starter message URL", LinkIcon);
          hideActionSheet();
        }}
      />
    </ActionsSection>
  );
});

export default ActionSheetRow ? newPatch() : oldPatch();