import { Classic } from "@caido/primevue";
import { usePassThrough } from "primevue/passthrough";

const FLOATING_SURFACE = "bg-surface-raised! border! border-line-default!";

const POPOVER_ARROW = [
  "before:border-b-line-default!",
  "after:border-b-surface-raised!",
  '[&[data-p-popover-flipped="true"]]:before:border-t-line-default!',
  '[&[data-p-popover-flipped="true"]]:after:border-t-surface-raised!',
].join(" ");

export const preset = usePassThrough(
  Classic,
  {
    dialog: {
      root: { class: FLOATING_SURFACE },
      footer: { class: "bg-transparent!" },
    },
    menu: {
      root: { class: FLOATING_SURFACE },
    },
    popover: {
      root: { class: `${FLOATING_SURFACE} ${POPOVER_ARROW}` },
    },
    tieredmenu: {
      root: { class: FLOATING_SURFACE },
      submenu: { class: FLOATING_SURFACE },
    },
  },
  { mergeSections: true, mergeProps: true },
);
