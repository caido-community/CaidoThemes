import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

import { App } from "@/App";
import { SDKProvider } from "@/stores/sdk";
import {
  activateTheme,
  getActiveThemeId,
  supportsDesignTokens,
} from "@/themes/activeTheme";
import type { CaidoSDK } from "@/types";

const queryClient = new QueryClient();

const restoreActiveTheme = async (sdk: CaidoSDK) => {
  const id = getActiveThemeId();
  if (id === undefined || !supportsDesignTokens()) {
    return;
  }

  const result = await sdk.backend.getTheme(id);
  if (result.kind === "Success") {
    activateTheme(result.value);
  }
};

export const init = async (sdk: CaidoSDK) => {
  const rootElement = document.createElement("div");
  Object.assign(rootElement.style, { height: "100%", width: "100%" });

  createRoot(rootElement).render(
    <SDKProvider sdk={sdk}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </SDKProvider>,
  );

  sdk.navigation.addPage("/themes", { body: rootElement });
  sdk.sidebar.registerItem("Themes", "/themes", { icon: "fas fa-palette" });

  await restoreActiveTheme(sdk);
};
