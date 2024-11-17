import { showDialog } from "../../../../lib/ui/AlertDialog";

export default function (staticApngOnFail) {
  showDialog({
    title: "APNG conversion failed",
    content: [
      (staticApngOnFail ? "Instead of an animated GIF, raw APNG sticker will be sent in chat" : "No stickers will be sent in chat") + ", you can customize this behavior in plugin settings.",
      "",
      "Check debug logs for more information about the error."
    ].join("\n"),
    confirmText: "OK"
  });
}