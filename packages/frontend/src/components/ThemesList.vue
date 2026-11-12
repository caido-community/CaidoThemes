<script setup lang="ts">
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Menu from "primevue/menu";
import type { MenuItem } from "primevue/menuitem";
import Tag from "primevue/tag";
import { useConfirm } from "primevue/useconfirm";
import type { Theme } from "shared";
import { computed, ref } from "vue";

import { useThemesStore } from "@/stores/themes";

const {
  themes,
  activeThemeId,
  editingTheme,
  edit,
  apply,
  turnOff,
  create,
  importFromFile,
  remove,
  reset,
} = useThemesStore();

const confirm = useConfirm();
const actionsMenu = ref<InstanceType<typeof Menu>>();

const selection = computed({
  get: () => editingTheme.value,
  set: (theme: Theme | undefined) => {
    if (theme !== undefined) {
      edit(theme.id);
    }
  },
});

const isActive = (theme: Theme) => theme.id === activeThemeId.value;

type DestructiveAction = {
  header: string;
  message: string;
  acceptLabel: string;
  accept: () => void;
};

const confirmDestructive = ({
  header,
  message,
  acceptLabel,
  accept,
}: DestructiveAction) =>
  confirm.require({
    header,
    message,
    accept,
    icon: "fas fa-triangle-exclamation",
    rejectProps: { label: "Cancel", severity: "contrast", text: true },
    acceptProps: { label: acceptLabel, severity: "danger" },
  });

const confirmReset = () =>
  confirmDestructive({
    header: "Reset themes",
    message:
      "This deletes every theme and restores the built-in ones. It cannot be undone.",
    acceptLabel: "Reset",
    accept: reset,
  });

const confirmDelete = (theme: Theme) =>
  confirmDestructive({
    header: "Delete theme",
    message: `Delete "${theme.name}"? This cannot be undone.`,
    acceptLabel: "Delete",
    accept: () => remove(theme.id),
  });

type RowAction = {
  label: string;
  icon: string;
  severity: "contrast" | "danger";
  disabled: boolean;
  run: () => void;
};

const rowActions = (theme: Theme): RowAction[] => [
  {
    label: isActive(theme) ? "Applied" : "Apply",
    icon: "fas fa-check",
    severity: "contrast",
    disabled: isActive(theme),
    run: () => apply(theme),
  },
  {
    label: "Delete",
    icon: "fas fa-trash",
    severity: "danger",
    disabled: false,
    run: () => confirmDelete(theme),
  },
];

const menuItems = computed<MenuItem[]>(() => [
  {
    label: "Import theme",
    icon: "fas fa-file-import",
    command: () => importFromFile(),
  },
  {
    label: "Turn off theme",
    icon: "fas fa-power-off",
    disabled: activeThemeId.value === undefined,
    command: turnOff,
  },
  { separator: true },
  {
    label: "Reset to built-in themes",
    icon: "fas fa-rotate-left",
    command: confirmReset,
  },
]);

const toggleActions = (event: Event) => actionsMenu.value?.toggle(event);
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center gap-2 p-4">
      <div class="mr-auto flex min-w-0 flex-col">
        <h1 class="text-title text-fg-strong">Themes</h1>
        <span class="text-caption text-fg-muted">
          Change Caido's colors for the light and dark appearance.
        </span>
      </div>
      <Button
        label="Actions"
        icon="fas fa-chevron-down"
        icon-pos="right"
        severity="contrast"
        aria-haspopup="true"
        aria-controls="themes-actions"
        @click="toggleActions"
      />
      <Menu id="themes-actions" ref="actionsMenu" :model="menuItems" popup />
      <Button label="New theme" icon="fas fa-plus" @click="create" />
    </div>

    <DataTable
      v-model:selection="selection"
      :value="themes"
      data-key="id"
      selection-mode="single"
      :meta-key-selection="false"
      striped-rows
      scrollable
      scroll-height="flex"
      class="min-h-0 flex-1"
    >
      <Column field="name" header="Name" class="w-1/4">
        <template #body="{ data }: { data: Theme }">
          <div class="flex items-center gap-2">
            <span class="truncate">{{ data.name }}</span>
            <Tag v-if="isActive(data)" value="Active" severity="success" />
          </div>
        </template>
      </Column>
      <Column field="description" header="Description">
        <template #body="{ data }: { data: Theme }">
          <span class="line-clamp-1 text-fg-subtle">{{
            data.description
          }}</span>
        </template>
      </Column>
      <Column field="author" header="Author" class="w-40" />
      <Column header="Actions" class="w-28">
        <template #body="{ data }: { data: Theme }">
          <div class="flex items-center gap-1">
            <Button
              v-for="action in rowActions(data)"
              :key="action.icon"
              v-tooltip.top="action.label"
              :icon="action.icon"
              text
              :severity="action.severity"
              :disabled="action.disabled"
              :aria-label="`${action.label} ${data.name}`"
              @click.stop="action.run()"
            />
          </div>
        </template>
      </Column>

      <template #empty>
        <div class="py-8 text-center text-fg-muted">
          No themes yet. Create one or reset to the built-in themes.
        </div>
      </template>
    </DataTable>
  </div>
</template>
