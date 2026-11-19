<script setup lang="ts">
import Card from "primevue/card";

const CARD_PT = {
  body: { class: "h-full p-0" },
  content: { class: "h-full" },
};
</script>

<template>
  <Card class="h-full overflow-hidden" :pt="CARD_PT">
    <template #content>
      <slot />
    </template>
  </Card>
</template>
