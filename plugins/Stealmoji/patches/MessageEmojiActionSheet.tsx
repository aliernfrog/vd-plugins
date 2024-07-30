import { React } from "@vendetta/metro/common";
import { after, before } from "@vendetta/patcher";
import { ErrorBoundary, Forms, General } from "@vendetta/ui/components";
import openMediaModal from "../lib/utils/openMediaModal";
import StealButtons from "../ui/components/StealButtons";
import { findByProps } from "@vendetta/metro";
import { findInReactTree } from "@vendetta/utils";
import { LazyActionSheet } from "../modules";

const { FormDivider } = Forms;
const { TouchableOpacity } = General;

// Android 194204 - MessageEmojiActionSheet can't be found from findByProps("GuildDetails") anymore
// We can either patch LazyActionSheet.openLazy or ActionSheet component(?)
// In this case, patching openLazy is better to keep compatibility with the old approach
const MessageEmojiActionSheet = findByProps("GuildDetails");

export default () => {
    if (MessageEmojiActionSheet) return patchSheet("default", MessageEmojiActionSheet);
    
    const patches = [];
    const unpatchLazy = before("openLazy", LazyActionSheet, ([lazySheet, name]) => {
        if (name !== "MessageEmojiActionSheet") return;
        unpatchLazy();

        lazySheet.then(module => {
            patches.push(after("default", module, (_, res) => {
                // res.type is the same as the no-longer-existing findByProps("GuildDetails").default
                patches.push(patchSheet("type", res, true));
            }));
        });
    });

    return () => (unpatchLazy(), patches.forEach(p => p?.()));
}

function patchSheet(funcName: string, sheetModule: any, once = false) {
    const unpatch = after(funcName, sheetModule, ([{ emojiNode }]: [{ emojiNode: EmojiNode }], res) => {
        React.useEffect(() => () => void (once && unpatch()), []);
        
        if (!emojiNode.src) return;
        
        const view = res?.props?.children?.props?.children;
        if (!view) return;
        
        const unpatchView = after("type", view, (_, component) => {
          React.useEffect(() => unpatchView, []);
          
          // Open the media modal when the emote is pressed
          const isIconComponent = (c) => c?.props?.source?.uri;
          const iconContainer = findInReactTree(component, (c) => c?.find?.(isIconComponent));
          const iconComponentIndex = iconContainer?.findIndex?.(isIconComponent) ?? -1;
          if (iconComponentIndex >= 0) {
            iconContainer[iconComponentIndex] = (
              <TouchableOpacity onPress={() => openMediaModal(emojiNode.src.split("?")[0])}>
                {iconContainer[iconComponentIndex]}
              </TouchableOpacity>
            )
          }
          
          // If a button is found, add StealButtons to its container, otherwise add to bottom
          const isButton = (c) => c?.type?.name === "Button";
          const buttonsContainer = findInReactTree(component, (c) => c?.find?.(isButton));
          const buttonIndex = buttonsContainer?.findLastIndex?.(isButton) ?? -1;
          if (buttonIndex >= 0) {
            buttonsContainer.splice(buttonIndex+1, 0, (
              <StealButtons emojiNode={emojiNode} />
            ));
          } else {
            component?.props?.children?.push?.((
              <StealButtons emojiNode={emojiNode} />
            ));
          }
        });
    });

    return unpatch;
}