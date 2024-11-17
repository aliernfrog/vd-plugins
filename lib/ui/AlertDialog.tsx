import { findByProps } from "@vendetta/metro";
import { showConfirmationAlert } from "@vendetta/ui/alerts";

const { openAlert } = findByProps("openAlert", "dismissAlert");
const { AlertModal, AlertActionButton } = findByProps("AlertModal", "AlertActions");
const { Stack } = findByProps("Stack");

export function showDialog(options) {
  if (AlertModal && AlertActionButton) showNewDialog(options);
  else showConfirmationAlert(options);
}

function showNewDialog({
  title, content, confirmText, cancelText, onConfirm
}) {
  openAlert(`vdarnfg-${title?.toLowerCase?.().replaceAll?.(" ","-")}`, <AlertModal
    title={title}
    content={content}
    actions={
      <Stack>
        <AlertActionButton
          text={confirmText}
          variant="primary"
          onPress={onConfirm} />
        {cancelText ? <AlertActionButton
          text={cancelText}
          variant="secondary" /> : <></>}
      </Stack>
    }
  />);
}