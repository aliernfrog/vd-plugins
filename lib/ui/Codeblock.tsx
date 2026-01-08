import { findByProps } from "@vendetta/metro";
import { ReactNative, constants } from "@vendetta/metro/common";
import { semanticColors } from "@vendetta/ui";

const { createStyles } = findByProps("createStyles");
const { /*Platform,*/ Text, TextInput } = ReactNative;

const useStyles = createStyles({
  codeBlock: {
    fontFamily: constants.Fonts.CODE_NORMAL,
    fontSize: 12,
    textAlignVertical: "center",
    backgroundColor: semanticColors.BACKGROUND_SECONDARY,
    color: semanticColors.TEXT_NORMAL ?? semanticColors.TEXT_DEFAULT,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: semanticColors.BACKGROUND_TERTIARY ?? semanticColors.BACKGROUND_BASE_LOWEST,
    padding: 10,
  }
});

// RN.Text selectable functionality is restored by passing an empty onPress callback.
// Does it work for iOS? i have no idea.
// If it does not, Platform selector must be restored and iOS must use the input based one.
const InputBasedCodeblock = ({ style, children }: CodeblockProps) => <TextInput editable={false} multiline style={[useStyles().codeBlock, style && style]} value={children} />;
const TextBasedCodeblock = ({ selectable, style, children }: CodeblockProps) => <Text onPress={() => {}} selectable={selectable} style={[useStyles().codeBlock, style && style]}>{children}</Text>;

export function Codeblock({ selectable, style, children }) {
  if (!selectable) return <TextBasedCodeblock style={style} children={children} />
  
  return <TextBasedCodeblock style={style} children={children} selectable />
  /*return Platform.select({
    ios: <InputBasedCodeblock style={style} children={children} />,
    default: <TextBasedCodeblock style={style} children={children} selectable />,
  });*/
}