<script setup lang="ts">
import { useId } from "vue";

const { label } = defineProps<{
  label: string;
}>();

defineSlots<{
  default(props: { id: string }): unknown;
}>();

const id = useId();
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="id" class="text-caption text-fg-muted">{{ label }}</label>
    <slot :id="id" />
  </div>
</template>
