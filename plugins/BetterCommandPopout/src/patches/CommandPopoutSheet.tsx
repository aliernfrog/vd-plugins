import { after, before } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";
import { findInReactTree } from "@vendetta/utils";
import { clipboard } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";

const ActionSheet = findByProps("openLazy", "hideActionSheet");
const { ActionSheetRow } = findByProps("ActionSheetRow");
const CopyIcon = getAssetIDByName("CopyIcon");

export default before("openLazy", ActionSheet, ([comp, tag]) => {
  if (!tag?.startsWith?.("ExecutedCommandPopout")) return;
  
  comp.then(instance => {
    const unpatchSheet = after("default", instance, (_, sheet) => {
      React.useEffect(() => unpatchSheet, []);
      
      const container = findInReactTree(sheet, c => c?.type?.name === "CommandActionsContainer");
      if (!container) return;
      
      const unpatchContainer = after("type", container, (info, containerComp) => {
        React.useEffect(() => unpatchContainer, []);
        
        const command = info?.[0]?.data;
        if (!command) return;
        
        const rows = findInReactTree(containerComp, t => t?.[0]?.props?.children?.type?.name === "TableRow");
        if (!rows) return;
        
        rows.unshift(
          <><ActionSheetRow
            label="Copy Command Mention"
            onPress={() => {
              const mention = `</${command.name}:${command.id}>`;
              clipboard.setString(mention);
              showToast("Copied command mention to clipboard", CopyIcon);
            }} /></>
          ,
          <><ActionSheetRow
            label="Copy Command ID"
            onPress={() => {
              clipboard.setString(command.id);
              showToast("Copied command ID to clipboard", CopyIcon);
            }} /></>
        );
      });
    });
  });
});