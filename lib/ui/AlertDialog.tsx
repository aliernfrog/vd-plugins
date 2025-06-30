import { logger } from "@vendetta";
import { findByProps } from "@vendetta/metro";
import { showConfirmationAlert, showInputAlert } from "@vendetta/ui/alerts";
import { showToast } from "@vendetta/ui/toasts";

const { openAlert } = findByProps("openAlert", "dismissAlert");
const { AlertModal, AlertActionButton } = findByProps("AlertModal", "AlertActions");
const { Stack, TextInput } = findByProps("Stack");

export function showDialog(options) {
  if (AlertModal && AlertActionButton) showNewDialog(options);
  else showConfirmationAlert(options);
}

function showNewDialog({
  title, content, placeholder, confirmText, cancelText, onConfirm
}) {
  openAlert(generateDialogKey(title), <AlertModal
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

export function showInputDialog(options) {
  if (AlertModal && AlertActionButton) showNewInputDialog(options);
  else showInputAlert(options);
}

function showNewInputDialog(options) {
  const key = generateDialogKey(options.title);
  openAlert(generateDialogKey(options.title), <NewInputDialog
    key={key}
    title={options.title}
    content={options.content}
    initialValue={options.initialValue}
    placeholder={options.placeholder}
    onConfirm={options.onConfirm}
    confirmText={options.confirmText}
    cancelText={options.cancelText}
    allowEmpty={options.allowEmpty}
  />);
}

function NewInputDialog({
  key, title, content, initialValue, placeholder, onConfirm, confirmText, cancelText, allowEmpty
}) {
  const [ value, setValue ] = React.useState(initialValue ?? "");
  //const [ isLoading, setIsLoading ] = React.useState(false);
  
  function loadConfirm() {
    if (!allowEmpty && !value.trim().length) return showToast("Cannot add with a blank name");
    onConfirm(value);
    /*setIsLoading(true);
    (async () => await onConfirm(value))()
      .then(() => dismissAlert(key))
      .catch((e) => {
        logger.error(`Failed to perform confirm for ${key}`, e);
        showToast("Something went wrong, check logs for more info");
      })
      .finally(() => setIsLoading(false));*/
  }
  
  return <AlertModal
    title={title}
    content={content}
    extraContent={
      <TextInput
        isClearable={true}
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        returnKeyType="done"
        onSubmitEditing={loadConfirm}
      />
    }
    actions={
      <Stack>
        <AlertActionButton
          disabled={!value.trim().length}
          text={confirmText}
          variant="primary"
          onPress={loadConfirm} />
        {cancelText ? <AlertActionButton
          text={cancelText}
          variant="secondary" /> : <></>}
      </Stack>
    }
  />
}

function generateDialogKey(title) {
  return `vdarnfg-${title?.toLowerCase?.().replaceAll?.(" ","-")}`;
}