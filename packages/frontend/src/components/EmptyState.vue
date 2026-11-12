<script setup lang="ts">
const { message } = defineProps<{
  message: string;
}>();
</script>

<template>
  <div class="flex h-full items-center justify-center p-4 text-fg-muted">
    {{ message }}
  </div>
</template>
