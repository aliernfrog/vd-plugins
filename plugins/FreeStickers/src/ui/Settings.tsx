import { findByName, findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { General } from "@vendetta/ui/components";

const { Stack, TableRadioGroup, TableRadioRow, TableSwitchRow, TableRowGroup } = findByProps("TableRow", "TableRowGroup");
const { ScrollView } = General;
const HelpMessage = findByName("HelpMessage");

const sizes = [
  16, 32, 64, 128, 160, 256, 512, 1024
];

storage.stickerSize ??= 160;

export default function Settings() {
  useProxy(storage);
  
  return <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
    <Stack style={{ paddingVertical: 24, paddingHorizontal: 12 }} spacing={24}>
      <TableRowGroup title="Options">
        <TableSwitchRow
          label="Show warning dialog for APNG stickers"
          subLabel="This will only appear once"
          value={!storage.ackedApng}
          onValueChange={(v: boolean) => {
            storage.ackedApng = !v;
          }}
        />
      </TableRowGroup>
      <TableRadioGroup
        title="Stickers Size"
        value={storage.stickerSize.toString()}
        onChange={v => storage.stickerSize = parseInt(v)}>
        {sizes.map(size => <TableRadioRow
          label={size.toString()}
          subLabel={size == 160 ? "Default" : null}
          key={size.toString()}
          value={size.toString()}
        />)}
      </TableRadioGroup>
      <HelpMessage messageType={0}>
        {"Stickers size option does not work consistently at the moment."}
      </HelpMessage>
    </Stack>
  </ScrollView>
}
