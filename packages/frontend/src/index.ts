import { layers } from "@caido/tokens";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from "primevue/tooltip";
import { createApp } from "vue";

import App from "@/App.vue";
import { preset } from "@/primevue";
import { createThemesStore, ThemesStoreKey } from "@/stores/themes";
import { supportsDesignTokens } from "@/themes/activeTheme";
import type { CaidoSDK } from "@/types";
import "@/styles/style.css";

const PAGE_PATH = "/themes";

export const init = async (sdk: CaidoSDK) => {
  const store = createThemesStore(sdk);

  const app = createApp(App);
  app.use(PrimeVue, {
    unstyled: true,
    pt: preset,
    zIndex: {
      menu: layers.floating,
      overlay: layers.floating,
      modal: layers.floating,
      tooltip: layers.floating,
    },
  });
  app.use(ConfirmationService);
  app.directive("tooltip", Tooltip);
  app.provide(ThemesStoreKey, store);

  const root = document.createElement("div");
  root.id = "plugin--caido-themes";
  Object.assign(root.style, { height: "100%", width: "100%" });
  app.mount(root);

  sdk.navigation.addPage(PAGE_PATH, { body: root });
  sdk.sidebar.registerItem("Themes", PAGE_PATH, { icon: "fas fa-palette" });

  await store.load();
  if (supportsDesignTokens()) {
    store.restoreActiveTheme();
  }
};
