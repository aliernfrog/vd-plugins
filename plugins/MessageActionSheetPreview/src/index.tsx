import { findByName, findByProps } from "@vendetta/metro";
import { after, before } from "@vendetta/patcher";
import { Forms } from "@vendetta/ui/components";
import { findInReactTree } from "@vendetta/utils";

const { default: ChatItemWrapper } = findByProps(
  "DCDAutoModerationSystemMessageView",
  "default"
);
const ActionSheet = findByProps("openLazy", "hideActionSheet");
const MessageRecord = findByName("MessageRecord");
const RowManager = findByName("RowManager");

const patch = before("openLazy", ActionSheet, ([comp, args, msg]) => {
  const message = msg?.message;
  if (args != "MessageLongPressActionSheet" || !message) return;
  
  comp.then(instance => {
    const unpatch = after("default", instance, (_, component) => {
      React.useEffect(() => () => { unpatch() }, []);

      const children = findInReactTree(component, (c) => c?.type?.name === "ActionSheetContentContainer")?.props?.children;
      if (!children) return;

      children.unshift(
        <ChatItemWrapper
          style={{
            paddingHorizontal: 14,
            paddingTop: 14
          }}
          rowGenerator={new RowManager()}
          message={new MessageRecord(message)}
        />
      );
    });
  });
});

export const onUnload = () => patch();