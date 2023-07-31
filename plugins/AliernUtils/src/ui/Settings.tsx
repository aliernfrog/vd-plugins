import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";

const { FormSection, FormSwitchRow } = Forms;
const { ScrollView } = General;

storage.AlwaysTabsV2 ??= true;
storage.ChatAnimations ??= true;

export default function Settings(reloadPatches) {
  return () => {
    useProxy(storage);
    
    return <ScrollView>
      <FormSection title="Useful experiments" titleStyleType="no_border">
        <FormSwitchRow
          label="Tabs v2"
          subLabel="Enable Tabs v2"
          value={storage.AlwaysTabsV2}
          onValueChange={(v) => {
            storage.AlwaysTabsV2 = v;
            reloadPatches();
          }}
        />
        <FormSwitchRow
          label="Chat animations (Android)"
          subLabel="Enable chat animations for Android"
          value={storage.ChatAnimations}
          onValueChange={(v) => {
            storage.ChatAnimations = v;
            reloadPatches();
          }}
        />
      </FormSection>
    </ScrollView>
  }
}