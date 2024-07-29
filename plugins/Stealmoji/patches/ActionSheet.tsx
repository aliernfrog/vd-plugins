import { React } from "@vendetta/metro/common";
import { after, before } from "@vendetta/patcher";
import { General } from "@vendetta/ui/components";
import openEmojiActionSheet from "../lib/utils/openEmojiActionSheet";
import { ActionSheet } from "../modules";

const { TouchableOpacity } = General;

export default () => before("render", ActionSheet, ([props]) => {
    // Checks if the action sheet is for message reactions
    if (!props?.header?.props?.reactions || props.children.type?.name !== "FastList") return;

    // Patch the header
    const unpatchReactionsHeader = after("type", props.header, (_, res) => {
        // Unpatch on unmount
        React.useEffect(() => unpatchReactionsHeader as () => void, []);

        try {
            const tabsRow = res.props.children[0];
            const { tabs, onSelect } = tabsRow.props;

            // Wrap the tabs in a TouchableOpacity so we can add a long press handler
            tabsRow.props.tabs = tabs.map((tab) => (
                <TouchableOpacity
                    onPress={() => onSelect(tab.props.index)}
                    onLongPress={() => {
                        const { emoji } = tab.props.reaction;
                        openEmojiActionSheet(emoji);
                    }}
                >
                    {tab}
                </TouchableOpacity>
            ));
        } catch {
            console.error("Failed to patch reaction header.");
        }
    });
});