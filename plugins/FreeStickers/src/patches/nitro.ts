import { findByProps } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";

const NitroModule = findByProps("canUseAnimatedEmojis");

const OLD_CHECK_NAME = "canUseStickersEverywhere";
const NEW_CHECK_NAME = "canUseCustomStickersEverywhere";
const CHECK_NAME = NitroModule[NEW_CHECK_NAME] ? NEW_CHECK_NAME : OLD_CHECK_NAME;

export default () => instead(CHECK_NAME, NitroModule, () => true);