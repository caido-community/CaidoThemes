import type { DefineAPI, SDK } from "caido:plugin";

import { createThemesApi, type ThemesApi } from "./api";
import { setupThemeStorage } from "./storage/setup";
import type { BackendEvents } from "./types";

export type { BackendEvents } from "./types";

export type API = DefineAPI<ThemesApi>;

export async function init(sdk: SDK<API, BackendEvents>) {
  const repository = await setupThemeStorage(await sdk.meta.db());
  const api = createThemesApi(repository);

  sdk.api.register("getThemes", api.getThemes);
  sdk.api.register("getTheme", api.getTheme);
  sdk.api.register("addTheme", api.addTheme);
  sdk.api.register("updateTheme", api.updateTheme);
  sdk.api.register("removeTheme", api.removeTheme);
  sdk.api.register("resetThemes", api.resetThemes);
}
