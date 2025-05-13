import CommandPopoutSheet from "./patches/CommandPopoutSheet";

const patches = [
  CommandPopoutSheet
];

export const onUnload = () => patches.forEach(p => p?.());