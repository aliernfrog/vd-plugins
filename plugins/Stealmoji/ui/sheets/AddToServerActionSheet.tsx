import { constants } from "@vendetta/metro/common";
import { ErrorBoundary, Forms } from "@vendetta/ui/components";
import AddToServerRow from "../components/AddToServerRow";

import {
    ActionSheet,
    ActionSheetCloseButton,
    ActionSheetTitleHeader,
    BottomSheetFlatList,
    GuildStore,
    LazyActionSheet,
    PermissionsStore
} from "../../modules";

const { FormDivider, FormIcon } = Forms;

export function showAddToServerActionSheet(emojiNode: EmojiNode) {
    const element = (
        <ActionSheet scrollable>
            <ErrorBoundary>
                <AddToServer emojiNode={emojiNode} />
            </ErrorBoundary>
        </ActionSheet>
    );

    LazyActionSheet.openLazy(
        Promise.resolve({ default: () => element }),
        "AddToServerActionSheet"
    );
}

// The sheet itself
function AddToServer({ emojiNode }: { emojiNode: EmojiNode }) {
    // Get guilds as a Array of ID and value pairs, and filter out guilds the user can't edit emojis in
    const guilds = Object.values(GuildStore.getGuilds())
        .filter(guild => PermissionsStore.can(constants.Permissions.MANAGE_GUILD_EXPRESSIONS, guild))
        .sort((a,b) => a.name?.localeCompare?.(b.name));

    return (
        <>
            <ActionSheetTitleHeader
                title={`Stealing ${emojiNode.alt}`}
                leading={<FormIcon
                    style={{ marginRight: 12, opacity: 1 }}
                    source={{ uri: emojiNode.src }}
                    disableColor // It actually does the opposite
                />}
                trailing={<ActionSheetCloseButton
                    onPress={() => LazyActionSheet.hideActionSheet()}
                />}
            />
            <BottomSheetFlatList
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 24 }}
                data={guilds}
                renderItem={({ item }) => (
                    <AddToServerRow
                        guild={item}
                        emojiNode={emojiNode}
                    />
                )}
                ItemSeparatorComponent={FormDivider}
                keyExtractor={x => x.id}
            />
        </>
    );
};
