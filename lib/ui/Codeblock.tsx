import { findByProps } from "@vendetta/metro";
import { ReactNative, constants } from "@vendetta/metro/common";
import { semanticColors } from "@vendetta/ui";

const { createStyles } = findByProps("createStyles");
const { /*Platform, */Text, TextInput } = ReactNative;

const useStyles = createStyles({
  codeBlock: {
    fontFamily: constants.Fonts.CODE_NORMAL,
    fontSize: 12,
    textAlignVertical: "center",
    backgroundColor: semanticColors.BACKGROUND_SECONDARY,
    color: semanticColors.TEXT_NORMAL,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: semanticColors.BACKGROUND_TERTIARY,
    padding: 10,
  }
});

// RN.Text selectable function was nuked after some Discord update? for both platforms?
const InputBasedCodeblock = ({ style, children }: CodeblockProps) => <TextInput editable={true} multiline style={[useStyles().codeBlock, style && style]} value={children} />;
const TextBasedCodeblock = ({ selectable, style, children }: CodeblockProps) => <Text selectable={selectable} style={[useStyles().codeBlock, style && style]}>{children}</Text>;

export function Codeblock({ selectable, style, children }) {
  //if (!selectable) return <TextBasedCodeblock style={style} children={children} />
  
  return <InputBasedCodeblock style={style} children={children} />
  /*return Platform.select({
    ios: <InputBasedCodeblock style={style} children={children} />,
    default: <TextBasedCodeblock style={style} children={children} selectable />,
  });*/
}