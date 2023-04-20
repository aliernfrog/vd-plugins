import { storage } from "@vendetta/plugin";
import { Forms, General } from "@vendetta/ui/components";
import { useProxy } from '@vendetta/storage';

const { FormSwitchRow } = Forms;
const { ScrollView } = General;

export default function Settings() {
  useProxy(storage);
  return <ScrollView>
    <FormSwitchRow
      label="Disable AMOLED theme when light theme is enabled"
      subLabel="AMOLED + light theme causes issues on 174.6 and above."
      value={storage.disableWhenLight}
      onValueChange={(v: boolean) => {
        storage.disableWhenLight = v;
      }}
    />
  </ScrollView>
}