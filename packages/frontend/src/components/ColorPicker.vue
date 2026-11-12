<script setup lang="ts">
import Button from "primevue/button";
import Popover from "primevue/popover";
import { computed, ref } from "vue";
import { ChromePicker } from "vue-color";
import "vue-color/style.css";

const { color, label, suggestions } = defineProps<{
  color: string | undefined;
  label: string;
  suggestions: string[];
}>();

const emit = defineEmits<{
  pick: [color: string];
}>();

const PICKER_FALLBACK = "#000000";
const PICKER_FORMATS: ("hex" | "rgb" | "hsl")[] = ["hex", "rgb", "hsl"];
const SWATCH_COLUMNS = 9;
const SWATCH_ROWS = 2;
const SWATCH_GRID = `repeat(${SWATCH_COLUMNS}, minmax(0, 1fr))`;
const CHECKERBOARD =
  "repeating-conic-gradient(#d4d4d4 0 25%, #fff 0 50%) 0 0 / 12px 12px";
const PICKER_THEME = {
  "--vc-picker-bg": "#fff",
  "--vc-body-bg": "var(--color-surface-raised)",
  "--vc-input-bg": "var(--color-surface-page)",
  "--vc-input-text": "var(--color-fg-default)",
  "--vc-input-label": "var(--color-fg-muted)",
  "--vc-input-border": "var(--color-line-default)",
  "--vc-chrome-toggle-btn-highlighted": "var(--color-surface-hover)",
};

const swatchBackground = (swatch: string | undefined) =>
  swatch === undefined
    ? CHECKERBOARD
    : `linear-gradient(${swatch}, ${swatch}), ${CHECKERBOARD}`;

const popover = ref<InstanceType<typeof Popover>>();
const visibleSuggestions = computed(() =>
  suggestions.slice(0, SWATCH_COLUMNS * SWATCH_ROWS),
);
const canPickFromScreen = window.EyeDropper !== undefined;

const pick = (value: unknown) => {
  if (typeof value === "string") {
    emit("pick", value.toLowerCase());
  }
};

const pickFromScreen = async () => {
  if (window.EyeDropper === undefined) {
    return;
  }

  const result = await new window.EyeDropper().open().catch(() => undefined);
  if (result !== undefined) {
    pick(result.sRGBHex);
  }
};

const toggle = (event: Event) => popover.value?.toggle(event);
</script>

<template>
  <button
    type="button"
    class="aspect-square h-full cursor-pointer rounded-md border border-line-default"
    :style="{ background: swatchBackground(color) }"
    :aria-label="`Pick ${label}`"
    @click="toggle"
  />
  <Popover ref="popover">
    <div class="flex w-64 flex-col gap-3" :style="PICKER_THEME">
      <ChromePicker
        :model-value="color ?? PICKER_FALLBACK"
        :formats="PICKER_FORMATS"
        class="w-full! rounded-md! font-[inherit]! shadow-none!"
        @update:model-value="pick"
      />

      <div class="flex items-center justify-between gap-2">
        <span class="text-caption text-fg-muted">Theme colors</span>
        <Button
          v-if="canPickFromScreen"
          v-tooltip.top="'Pick from screen'"
          icon="fas fa-eye-dropper"
          text
          severity="contrast"
          size="small"
          aria-label="Pick from screen"
          @click="pickFromScreen"
        />
      </div>
      <div class="grid gap-1" :style="{ gridTemplateColumns: SWATCH_GRID }">
        <button
          v-for="suggestion in visibleSuggestions"
          :key="suggestion"
          v-tooltip.top="suggestion"
          type="button"
          class="aspect-square cursor-pointer rounded border border-line-default"
          :style="{ background: swatchBackground(suggestion) }"
          :aria-label="`Use ${suggestion}`"
          @click="pick(suggestion)"
        />
      </div>
    </div>
  </Popover>
</template>
