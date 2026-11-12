<script setup lang="ts">
import Accordion from "primevue/accordion";
import AccordionContent from "primevue/accordioncontent";
import AccordionHeader from "primevue/accordionheader";
import AccordionPanel from "primevue/accordionpanel";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import type { MenuItem } from "primevue/menuitem";
import SelectButton from "primevue/selectbutton";
import SplitButton from "primevue/splitbutton";
import Textarea from "primevue/textarea";
import {
  type Mode,
  setTokenColor,
  type Theme,
  type ThemeToken,
  TOKEN_GROUPS,
  TOKEN_LABELS,
  usedColors,
} from "shared";
import { computed, ref } from "vue";

import ColorField from "@/components/ColorField.vue";
import FormField from "@/components/FormField.vue";
import { useThemesStore } from "@/stores/themes";
import { getCurrentMode } from "@/themes/activeTheme";
import { describeFallback } from "@/themes/fallback";

const { theme } = defineProps<{
  theme: Theme;
}>();

const { activeThemeId, closeEditor, exportTheme, save, saveAndApply } =
  useThemesStore();

const MODE_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const OPEN_GROUPS = ["Backgrounds"];

const draft = ref<Theme>({ ...theme });
const mode = ref<Mode>(getCurrentMode());

const colorOf = (token: ThemeToken) =>
  draft.value.tokens[token]?.[mode.value] ?? "";

const setColor = (token: ThemeToken, color: string) => {
  draft.value = setTokenColor(draft.value, token, mode.value, color);
};

const themeColors = computed(() => usedColors(draft.value, mode.value));

const saveOptions = computed<MenuItem[]>(() => [
  {
    label: "Save and apply",
    icon: "fas fa-check",
    disabled: activeThemeId.value === theme.id,
    command: () => saveAndApply(draft.value),
  },
]);

const countCustomColors = (tokens: readonly ThemeToken[]) =>
  tokens.filter((token) => colorOf(token) !== "").length;
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center gap-2 border-b border-line-subtle px-4 py-3">
      <h2 class="min-w-0 flex-1 truncate text-heading text-fg-strong">
        {{ draft.name }}
      </h2>
      <Button
        v-tooltip.left="'Close'"
        icon="fas fa-xmark"
        text
        severity="contrast"
        aria-label="Close editor"
        @click="closeEditor"
      />
    </div>

    <div class="flex min-h-0 flex-1 flex-col gap-6 overflow-auto p-4">
      <section class="grid grid-cols-2 gap-4">
        <FormField v-slot="{ id }" label="Name">
          <InputText :id="id" v-model="draft.name" />
        </FormField>
        <FormField v-slot="{ id }" label="Author">
          <InputText :id="id" v-model="draft.author" />
        </FormField>
        <FormField v-slot="{ id }" label="Description" class="col-span-2">
          <Textarea :id="id" v-model="draft.description" rows="2" auto-resize />
        </FormField>
      </section>

      <section class="flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-heading text-fg-strong">Colors</h3>
          <SelectButton
            v-model="mode"
            :options="MODE_OPTIONS"
            option-label="label"
            option-value="value"
            :allow-empty="false"
            aria-label="Appearance"
          />
        </div>

        <Accordion :value="OPEN_GROUPS" multiple>
          <AccordionPanel
            v-for="group in TOKEN_GROUPS"
            :key="group.title"
            :value="group.title"
            class="last:border-b-0!"
          >
            <AccordionHeader>
              <span class="flex-1 text-left">{{ group.title }}</span>
              <span class="px-2 text-caption text-fg-muted">
                {{ countCustomColors(group.tokens) }} /
                {{ group.tokens.length }}
              </span>
            </AccordionHeader>
            <AccordionContent>
              <div class="flex flex-col gap-5">
                <ColorField
                  v-for="token in group.tokens"
                  :key="token"
                  :label="TOKEN_LABELS[token]"
                  :model-value="colorOf(token)"
                  :fallback="describeFallback(draft, token, mode)"
                  :suggestions="themeColors"
                  @update:model-value="setColor(token, $event)"
                />
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </section>
    </div>

    <div class="flex justify-end gap-2 border-t border-line-subtle px-4 py-3">
      <Button
        label="Export"
        icon="fas fa-download"
        severity="contrast"
        @click="exportTheme(draft)"
      />
      <SplitButton
        label="Save"
        icon="fas fa-floppy-disk"
        :model="saveOptions"
        @click="save(draft)"
      />
    </div>
  </div>
</template>
