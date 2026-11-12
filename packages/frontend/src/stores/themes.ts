import type { Result, Theme, ThemeContent } from "shared";
import { computed, inject, type InjectionKey, ref } from "vue";

import {
  activateTheme,
  deactivateTheme,
  getActiveThemeId,
} from "@/themes/activeTheme";
import { downloadTheme, pickThemeFile } from "@/themes/files";
import type { CaidoSDK } from "@/types";

const NEW_THEME: ThemeContent = {
  version: 2,
  name: "New theme",
  description: "",
  author: "",
  tokens: {},
};

export const createThemesStore = (sdk: CaidoSDK) => {
  const themes = ref<Theme[]>([]);
  const activeThemeId = ref(getActiveThemeId());
  const editingId = ref<string | undefined>(undefined);
  const editingTheme = computed(() =>
    themes.value.find((theme) => theme.id === editingId.value),
  );

  const toast = (message: string, variant: "success" | "error") =>
    sdk.window.showToast(message, { variant });

  const request = async <T>(promise: Promise<Result<T>>) => {
    const result = await promise;
    if (result.kind === "Error") {
      toast(result.error, "error");
      return undefined;
    }

    return result.value;
  };

  const load = async () => {
    const list = await request(sdk.backend.getThemes());
    if (list !== undefined) {
      themes.value = list;
    }
  };

  const edit = (id: string | undefined) => {
    editingId.value = id;
  };

  const closeEditor = () => edit(undefined);

  const apply = (theme: Theme) => {
    activateTheme(theme);
    activeThemeId.value = theme.id;
  };

  const restoreActiveTheme = () => {
    const active = themes.value.find(
      (theme) => theme.id === activeThemeId.value,
    );
    if (active !== undefined) {
      apply(active);
    }
  };

  const turnOff = () => {
    deactivateTheme();
    activeThemeId.value = undefined;
  };

  const add = async (input: unknown) => {
    const theme = await request(sdk.backend.addTheme(input));
    if (theme !== undefined) {
      await load();
      edit(theme.id);
    }

    return theme;
  };

  const create = () => add(NEW_THEME);

  const importFromFile = async () => {
    const theme = await add(await pickThemeFile());
    if (theme !== undefined) {
      toast("Theme imported", "success");
    }
  };

  const update = async ({ id, ...content }: Theme) => {
    const theme = await request(sdk.backend.updateTheme(id, content));
    if (theme !== undefined) {
      await load();
    }

    return theme;
  };

  const save = async (draft: Theme) => {
    const theme = await update(draft);
    if (theme === undefined) {
      return;
    }

    if (activeThemeId.value === theme.id) {
      apply(theme);
    }
    toast("Theme saved", "success");
  };

  const saveAndApply = async (draft: Theme) => {
    const theme = await update(draft);
    if (theme === undefined) {
      return;
    }

    apply(theme);
    toast("Theme saved and applied", "success");
  };

  const remove = async (id: string) => {
    const removedId = await request(sdk.backend.removeTheme(id));
    if (removedId === undefined) {
      return;
    }

    if (activeThemeId.value === id) {
      turnOff();
    }
    if (editingId.value === id) {
      closeEditor();
    }
    await load();
  };

  const reset = async () => {
    const list = await request(sdk.backend.resetThemes());
    if (list === undefined) {
      return;
    }

    turnOff();
    closeEditor();
    themes.value = list;
    toast("Built-in themes restored", "success");
  };

  return {
    themes,
    activeThemeId,
    editingTheme,
    load,
    edit,
    closeEditor,
    apply,
    restoreActiveTheme,
    turnOff,
    create,
    importFromFile,
    exportTheme: downloadTheme,
    save,
    saveAndApply,
    remove,
    reset,
  };
};

type ThemesStore = ReturnType<typeof createThemesStore>;

export const ThemesStoreKey: InjectionKey<ThemesStore> = Symbol("ThemesStore");

export const useThemesStore = () => {
  const store = inject(ThemesStoreKey);
  if (store === undefined) {
    throw new Error("useThemesStore must be used inside the Caido Themes app");
  }

  return store;
};
