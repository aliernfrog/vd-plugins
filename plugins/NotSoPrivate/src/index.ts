import { installPlugin, removePlugin } from "@vendetta/plugins";
import { showConfirmationAlert } from "@vendetta/ui/alerts";
import { showToast } from "@vendetta/ui/toasts";

showConfirmationAlert({
  title: "NotSoPrivate 👋",
  content: "NotSoPrivate functions have been moved to AliernUtils. Do you want to migrate to new plugin now?",
  confirmText: "Migrate now!",
  cancelText: "Remind later",
  onConfirm: async () => {
    await installPlugin("https://aliernfrog.github.io/vd-plugins/AliernUtils");
    await removePlugin("https://aliernfrog.github.io/vd-plugins/NotSoPrivate");
    showToast("Succesfully migrated to AliernUtils!");
  }
});