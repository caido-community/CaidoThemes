<script setup lang="ts">
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { isHexColor } from "shared";
import { computed, useId } from "vue";

import ColorPicker from "@/components/ColorPicker.vue";
import type { ColorFallback } from "@/themes/fallback";

const { label, fallback, suggestions } = defineProps<{
  label: string;
  fallback: ColorFallback;
  suggestions: string[];
}>();

const color = defineModel<string>({ required: true });

const id = useId();
const isCustom = computed(() => color.value !== "");
const isInvalid = computed(() => isCustom.value && !isHexColor(color.value));

const placeholder = computed(() =>
  fallback.color === undefined
    ? fallback.status
    : `${fallback.status} (${fallback.color})`,
);

const effectiveColor = computed(() =>
  isHexColor(color.value) ? color.value : fallback.color,
);
</script>

<template>
  <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
    <div class="row-span-2">
      <ColorPicker
        :color="effectiveColor"
        :label="label"
        :suggestions="suggestions"
        @pick="color = $event"
      />
    </div>
    <label :for="id" class="text-caption text-fg-muted">{{ label }}</label>
    <div class="flex min-w-0 items-center gap-2">
      <InputText
        :id="id"
        v-model="color"
        :placeholder="placeholder"
        :invalid="isInvalid"
        class="min-w-0 flex-1"
      />
      <Button
        v-if="isCustom"
        v-tooltip.top="'Use default'"
        icon="fas fa-rotate-left"
        text
        severity="contrast"
        :aria-label="`Reset ${label}`"
        class="size-8 shrink-0"
        @click="color = ''"
      />
    </div>
    <small v-if="isInvalid" class="col-start-2 text-caption text-fg-danger">
      Use a hex color, such as #1a2b3c
    </small>
  </div>
</template>
