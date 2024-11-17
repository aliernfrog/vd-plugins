import nitroPatch from "./patches/nitro";
import messagePatch from "./patches/message";

let patches;

export const onLoad = () => {
  if (patches) onUnload();
  patches = [
    nitroPatch(),
    messagePatch()
  ];
}

export const onUnload = () => patches?.forEach?.(unpatch => unpatch?.());