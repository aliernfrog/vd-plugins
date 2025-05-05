import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { General } from "@vendetta/ui/components";

const { Stack, TableRowGroup, TextInput } = findByProps("Stack", "TableRowGroup");
const { ScrollView } = General;

storage.guildWhitelist ??= "";

export default function Settings() {
  useProxy(storage);
  
  return <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
    <Stack style={{ paddingVertical: 24, paddingHorizontal: 12 }} spacing={24}>
      <TableRowGroup title="Server whitelist">
        <TextInput
          value={storage.guildWhitelist}
          onChange={v => storage.guildWhitelist = v}
        />
      </TableRowGroup>
    </Stack>
  </ScrollView>
}