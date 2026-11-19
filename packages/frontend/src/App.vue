<script setup lang="ts">
import ConfirmDialog from "primevue/confirmdialog";

import EmptyState from "@/components/EmptyState.vue";
import Panel from "@/components/Panel.vue";
import ThemeEditor from "@/components/ThemeEditor.vue";
import ThemesList from "@/components/ThemesList.vue";
import { useThemesStore } from "@/stores/themes";
import { supportsDesignTokens } from "@/themes/activeTheme";

const { draft } = useThemesStore();
const isSupported = supportsDesignTokens();
</script>

<template>
  <div class="flex h-full gap-1 text-body text-fg-default">
    <EmptyState
      v-if="!isSupported"
      message="Caido Themes requires Caido 0.60 or later."
    />
    <template v-else>
      <Panel class="min-w-0 flex-1">
        <ThemesList />
      </Panel>
      <Panel v-if="draft !== undefined" class="w-128 shrink-0">
        <ThemeEditor :key="draft.id" :draft="draft" />
      </Panel>
    </template>
    <ConfirmDialog />
  </div>
</template>
