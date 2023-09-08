import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";
import { defaultStickerURL } from "../utils";

const { FormInput, FormRow, FormSection, FormSwitchRow, FormText } = Forms;
const { ScrollView } = General;

storage.stickerURL ??= defaultStickerURL;

export default function Settings() {
  useProxy(storage);
  
  return <ScrollView>
    <FormSection title="Sticker URL" titleStyleType="no_border">
      <FormInput
        placeholder={defaultStickerURL}
        value={storage.stickerURL}
        onChange={v => {
          storage.stickerURL = (v == "") ? defaultStickerURL : v;
        }}
      />
      <FormText style={{ paddingHorizontal: 14 }}>{[
        "URL to use for stickers.",
        "{stickerId} will be replaced with sticker ID",
        "{extension} will be replaced with extension (currently always 'png')"
      ].join("\n")}</FormText>
    </FormSection>
    <FormSection title="Misc">
      <FormSwitchRow
        label="Show warning dialog for APNG stickers"
        subLabel="This will only appear once"
        value={!storage.acknowledgedApng}
        onValueChange={(v: boolean) => {
          storage.acknowledgedApng = !v;
        }}
      />
      <FormRow
        label="Restore default configuration"
        onPress={() => {
          storage.stickerURL = defaultStickerURL;
          storage.acknowledgedApng = false;
          showToast("Restored default configuration.");
        }}
      />
    </FormSection>
  </ScrollView>
}