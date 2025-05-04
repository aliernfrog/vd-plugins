import { findByProps } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";
import { showInputAlert } from "@vendetta/ui/alerts";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { Forms } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";
import fetchImageAsDataURL from "../../lib/utils/fetchImageAsDataURL";
import { EmojiStore, Emojis, GuildIcon, GuildIconSizes, LazyActionSheet } from "../../modules";

const emojiSlotModule = findByProps("getMaxEmojiSlots");
const { FormRow, FormIcon } = Forms;

export default function AddToServerRow({ guild, emojiNode }: { guild: any, emojiNode: EmojiNode }) {
    const addToServerCallback = () => {
        showInputAlert({
            title: "Emoji name",
            initialValue: emojiNode.alt,
            placeholder: "bleh",
            onConfirm: (name) => {
                // Fetch image
                fetchImageAsDataURL(emojiNode.src, (dataUrl) => {
                    // Upload it to Discord
                    Emojis.uploadEmoji({
                        guildId: guild.id,
                        image: dataUrl,
                        name: name,
                        roles: undefined
                    }).then(() => {
                        // Let user know it was added
                        showToast(`Added ${emojiNode.alt} ${(emojiNode.alt !== name) ? `as ${name} ` : ""}to ${guild.name}`, getAssetIDByName("Check"));
                    }).catch((e) => {
                        showToast(e.body.message, getAssetIDByName("Small"))
                    });
                });
            },
            confirmText: `Add to ${guild.name}`,
            confirmColor: undefined,
            cancelText: "Cancel"
        })
        // Close the sheet
        LazyActionSheet.hideActionSheet();
    };
    
    let isSlotsUnknown = false;
    const slotsAvailable = React.useMemo(() => {
        let maxSlots = guild.getMaxEmojiSlots?.() ?? emojiSlotModule?.getMaxEmojiSlots?.(guild);
        if (!maxSlots) {
          if (!isSlotsUnknown) {
            isSlotsUnknown = true;
            showToast("Failed to check max emoji slots");
          }
          maxSlots = 250;
        }
        
        const guildEmojis = EmojiStore.getGuilds()[guild.id]?.emojis ?? [];
        const isAnimated = emojiNode.src.includes(".gif");

        return guildEmojis.filter(e => e?.animated === isAnimated).length < maxSlots;
    }, []);

    return (<FormRow
        leading={
            <GuildIcon
                guild={guild}
                size={GuildIconSizes.MEDIUM}
                animate={false}
            />
        }
        disabled={!slotsAvailable}
        label={guild.name}
        subLabel={!slotsAvailable ? "No slots available" : isSlotsUnknown ? "Failed to check max emoji slots" : void 0}
        trailing={<FormIcon style={{ opacity: 1 }} source={getAssetIDByName("ic_add_24px")} />}
        onPress={addToServerCallback}
    />)
}
