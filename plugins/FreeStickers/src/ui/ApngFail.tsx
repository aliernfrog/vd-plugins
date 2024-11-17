import { showDialog } from "../../../../lib/ui/AlertDialog";

export default function () {
  showDialog({
    title: "APNG conversion failed",
    content: "Check debug logs for more information.",
    confirmText: "OK"
  });
}