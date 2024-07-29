import { findByProps } from "@vendetta/metro";
import { clipboard, ReactNative } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import fetchImageAsDataURL from "../../lib/utils/fetchImageAsDataURL";
import { downloadMediaAsset, LazyActionSheet } from "../../modules";
import { showAddToServerActionSheet } from "../sheets/AddToServerActionSheet";

const { Button } = findByProps("TableRow", "Button");

export default function StealButtons({ emojiNode }: { emojiNode: EmojiNode }) {
    const buttons = [
        {
            text: "Add to Server",
            callback: () => showAddToServerActionSheet(emojiNode)
        },
        {
            text: "Copy URL to clipboard",
            callback: () => {
                clipboard.setString(emojiNode.src);
                LazyActionSheet.hideActionSheet();
                showToast(`Copied ${emojiNode.alt}'s URL to clipboard`, getAssetIDByName("ic_copy_message_link"));
            }
        },
        ...ReactNative.Platform.select({
            ios: [
                {
                    text: "Copy image to clipboard",
                    callback: () => fetchImageAsDataURL(emojiNode.src, (dataUrl) => {
                        clipboard.setImage(dataUrl.split(',')[1]);
                        LazyActionSheet.hideActionSheet();
                        showToast(`Copied ${emojiNode.alt}'s image to clipboard`, getAssetIDByName("ic_message_copy"));
                    })
                }
            ],
            default: []
        }),
        {
            text: `Save image to ${ReactNative.Platform.select({ android: "Downloads", default: "Camera Roll" })}`,
            callback: () => {
                downloadMediaAsset(emojiNode.src, !emojiNode.src.includes(".gif") ? 0 : 1);
                LazyActionSheet.hideActionSheet();
                showToast(`Saved ${emojiNode.alt}'s image to ${ReactNative.Platform.select({ android: "Downloads", default: "Camera Roll" })}`, getAssetIDByName("toast_image_saved"));
            }
        }
    ]

    return <>
        {buttons.map(({ text, callback }) =>
            <Button
                color={Button.Colors?.BRAND}
                text={text}
                size={Button.Sizes?.SMALL}
                onPress={callback}
                style={{ marginTop: ReactNative.Platform.select({ android: 12, default: 16 }) }}
            />
        )}
    </>
};
