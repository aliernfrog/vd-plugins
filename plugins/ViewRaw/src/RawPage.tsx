import { findByProps } from "@vendetta/metro";
import { ReactNative, clipboard, React } from "@vendetta/metro/common";
import { showToast } from "@vendetta/ui/toasts";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { Codeblock } from "@vendetta/ui/components";
import { cleanMessage } from "./cleanMessage";

const { Button } = findByProps("Button", "Stack");
const { ScrollView } = ReactNative;

export default function RawPage({ message }) {
  const stringMessage = React.useMemo(() => JSON.stringify(cleanMessage(message), null, 4), [message.id]);

  const style = { margin: 8 }

  return (<>
    <ScrollView style={{ flex: 1 }}>
      <Button
        text="Copy Raw Content"
        style={style}
        variant="secondary"
        disabled={!message.content}
        onPress={() => {
          clipboard.setString(message.content);
          showToast("Copied content to clipboard", getAssetIDByName("toast_copy_link"));
        }}
      />
      <Button
        text="Copy Raw Data"
        style={style}
        variant="secondary"
        onPress={() => {
          clipboard.setString(stringMessage);
          showToast("Copied data to clipboard", getAssetIDByName("toast_copy_link"));
        }}
      />
      {message.content && <Codeblock selectable style={style}>{message.content}</Codeblock>}
      <Codeblock selectable style={style}>{stringMessage}</Codeblock>
    </ScrollView>
  </>);
}
