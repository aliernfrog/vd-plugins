import { findByProps } from "@vendetta/metro";
import { LazyActionSheet, Surrogates } from "../../modules";
import lazy from "./lazy";

const getTapEmojiHandler = lazy(() => {
    const { MessagesHandlers } = findByProps("MessagesHandlers");
    const instance = new MessagesHandlers(() => {});
    instance.isModalOrActionsheetObstructing = () => LazyActionSheet.hideActionSheet();
    return (emojiNode) => instance.handleTapEmoji({ nativeEvent: { node: emojiNode }});
});

export default function openEmojiActionSheet({ id, name, animated }) {
    try {
        getTapEmojiHandler()(
            id ? {
                id: id,
                alt: name,
                src: `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "webp"}?size=128`,
            } : {
                content: Surrogates.convertSurrogateToName(name),
                surrogate: name,
            }
        );
    } catch (err) {
        console.log("Failed to open action sheet", err);
    }
}