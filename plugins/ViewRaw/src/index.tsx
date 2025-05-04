import { before, after } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { findInReactTree } from "@vendetta/utils";
import { findByName, findByProps } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";
import RawPage from "./RawPage";

const ActionSheet = findByProps("openLazy", "hideActionSheet");
const { ActionSheetRow } = findByProps("ActionSheetRow");
const Navigation = findByProps("push", "pushLazy", "pop");
const modalCloseButton =
  findByProps("getRenderCloseButton")?.getRenderCloseButton ??
  findByProps("getHeaderCloseButton")?.getHeaderCloseButton;
const Navigator = findByName("Navigator") ?? findByProps("Navigator")?.Navigator;

const unpatch = before("openLazy", ActionSheet, ([component, key, msg]) => {
  const message = msg?.message;
  if (key !== "MessageLongPressActionSheet" || !message) return;
  
  component.then(instance => {
    const unpatch = after("default", instance, (_, component) => {
      React.useEffect(() => () => { unpatch() }, []);
      
      const buttons = findInReactTree(component,
        c => c?.some?.(child => child?.type?.name === "ButtonRow" || child?.type?.name === "ActionSheetRow")
      );
      if (!buttons) return;

      const navigator = () => (
        <Navigator
          initialRouteName="RawPage"
          goBackOnBackPress
          screens={{
            RawPage: {
              title: "ViewRaw",
              headerLeft: modalCloseButton?.(() => Navigation.pop()),
              render: () => <RawPage message={message} />
            }
          }}
        />
      );

      buttons.push(
        <ActionSheetRow
          label="View Raw"
          icon={
            <ActionSheetRow.Icon
              source={getAssetIDByName("ChatIcon")}
            />
          }
          onPress={() => {
            ActionSheet.hideActionSheet();
            Navigation.push(navigator);
          }}
        />
      );
    });
  });
});

export const onUnload = () => unpatch();