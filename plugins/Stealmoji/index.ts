import patchMessageEmojiActionSheet from "./patches/MessageEmojiActionSheet";
import patchActionSheet from "./patches/ActionSheet";

let patches = [];

export default {
    onLoad: () => {
        patches.push(patchMessageEmojiActionSheet());
        patches.push(patchActionSheet());
    },
    onUnload: () => {
        for (const unpatch of patches) {
            unpatch();
        };
    },
}