import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { Forms, General } from "@vendetta/ui/components";

const { FormIcon, FormSection, FormSwitchRow } = Forms;
const { ScrollView } = General;

storage.AlwaysTabsV2 ??= true;
storage.ChatAnimations ??= true;
storage.FixExperiments ??= true;

export default function Settings(reloadPatches) {
  return () => {
    useProxy(storage);
    
    return <ScrollView>
      <FormSection title="Useful experiments" titleStyleType="no_border">
        <FormSwitchRow
          label="Tabs v2"
          subLabel="Enable Tabs v2"
          leading={
            <FormIcon
              source={getAssetIDByName("ic_mobile_device")}
            />
          }
          value={storage.AlwaysTabsV2}
          onValueChange={(v) => {
            storage.AlwaysTabsV2 = v;
            reloadPatches();
          }}
        />
        <FormSwitchRow
          label="Chat animations (Android)"
          subLabel="Enable chat animations for Android"
          leading={
            <FormIcon
              source={getAssetIDByName("ic_chat")}
            />
          }
          value={storage.ChatAnimations}
          onValueChange={(v) => {
            storage.ChatAnimations = v;
            reloadPatches();
          }}
        />
      </FormSection>
      
      <FormSection title="Misc">
        <FormSwitchRow
          label="Reload experiments plugin"
          subLabel="Reload experiments plugin after 15 seconds"
          leading={
            <FormIcon
              source={getAssetIDByName("ic_cog_24px")}
            />
          }
          value={storage.FixExperiments}
          onValueChange={(v) => {
            storage.FixExperiments = v;
            reloadPatches();
          }}
        />
      </FormSection>
    </ScrollView>
  }
}