import { showDialog } from "../../../../lib/ui/AlertDialog";

export default function (onConfirm) {
  showDialog({
    title: "APNG Sticker",
    content: "This sticker will be converted to a GIF using Ezgif and an Ezgif link will be sent in chat.\nDo you want to continue?",
    confirmText: "Continue",
    cancelText: "Cancel",
    onConfirm
  });
}