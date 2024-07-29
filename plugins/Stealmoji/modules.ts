import { find, findByProps, findByStoreName } from "@vendetta/metro";

export const Surrogates = findByProps("convertSurrogateToName");
export const LazyActionSheet = findByProps("hideActionSheet");
export const MediaModalUtils = findByProps("openMediaModal");
export const Emojis = findByProps("uploadEmoji");

export const ActionSheet = findByProps("ActionSheet")?.ActionSheet ?? find(m => m.render?.name === "ActionSheet");

export const { 
    ActionSheetTitleHeader, 
    ActionSheetCloseButton 
} = findByProps("ActionSheetTitleHeader");

export const { 
    BottomSheetFlatList 
} = findByProps("BottomSheetScrollView");

export const EmojiStore = findByStoreName("EmojiStore");
export const GuildStore = findByStoreName("GuildStore");
export const PermissionsStore = findByStoreName("PermissionStore");

export const {
    default: GuildIcon,
    GuildIconSizes
} = findByProps("GuildIconSizes");

export const { 
    downloadMediaAsset
} = findByProps("downloadMediaAsset");