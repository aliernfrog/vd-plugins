import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { General } from "@vendetta/ui/components";

const { TableRadioRow, TableSwitchRow, TableRowGroup } = findByProps("TableRow", "TableRowGroup");
const { ScrollView } = General;

const sizes = [
  16, 32, 64, 128, 160, 256, 512, 1024
];

storage.stickerSize ??= 160;

export default function Settings() {
  useProxy(storage);
  
  return <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
    <Stack style={{ paddingVertical: 24, paddingHorizontal: 12 }} spacing={24}>
      <TableRowGroup title="Sticker size">
        {sizes.map(size => <TableRadioRow
          label={size.toString()}
          subLabel={size == 160 ? "Default" : null}
          checked={storage.stickerSize == size}
          onPress={() => storage.stickerSize = size}
        />)}
      </TableRowGroup>
      <TableRowGroup title="Misc">
        <TableSwitchRow
          label="Show warning dialog for APNG stickers"
          subLabel="This will only appear once"
          value={!storage.ackedApng}
          onValueChange={(v: boolean) => {
            storage.ackedApng = !v;
          }}
        />
      </TableRowGroup>
    </Stack>
  </ScrollView>
}