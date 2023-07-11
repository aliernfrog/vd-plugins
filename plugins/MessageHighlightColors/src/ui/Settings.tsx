import { ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms, General } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";

const { FormInput, FormRow, FormSection, FormText } = Forms;
const { ScrollView } = General;

const colorOptions = [
  {
    label: "Pending reply bar color",
    key: "replyBarColor",
    default: "#949cf7"
  },
  {
    label: "Pending reply background color",
    key: "replyBgColor",
    default: "#949cf730"
  },
  {
    label: "Pending edit bar color",
    key: "editBarColor",
    default: "#00aa5d"
  },
  {
    label: "Pending edit background color",
    key: "editBgColor",
    default: "#00aa5d30"
  }
];

const resetColors = (deleteExisting) => colorOptions.forEach(o => {
  if (deleteExisting) delete storage[o.key];
  storage[o.key] ??= o.default;
});
resetColors();

export default function Settings() {
  useProxy(storage);
  
  return <ScrollView>
    <FormSection title="Colors" titleStyleType="no_border">
      <ReactNative.FlatList
        data={colorOptions}
        renderItem={({item}) => {
          return <FormInput
            title={item.label}
            placeholder={"#RRGGBBAA"}
            value={storage[item.key]}
            onChange={v => storage[item.key] = v}
          />
        }}
      />
      <FormText style={{ paddingHorizontal: 14 }}>
        {"Leave empty to use Discord colors"}
      </FormText>
    </FormSection>
    <FormSection title="Misc">
      <FormRow
        label="Restore plugin defaults"
        onPress={() => {
          resetColors();
          showToast("Restored plugin defaults.");
        }}
      />
    </FormSection>
  </ScrollView>
}