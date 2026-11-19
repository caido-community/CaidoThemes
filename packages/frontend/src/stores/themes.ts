import {
  error,
  isSameTheme,
  parseJson,
  type Result,
  type Theme,
  type ThemeContent,
  validateTheme,
} from "shared";
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

const messageOf = (reason: unknown) =>
  reason instanceof Error ? reason.message : "Something went wrong";

export const createThemesStore = (sdk: CaidoSDK) => {
  const themes = ref<Theme[]>([]);
  const activeThemeId = ref(getActiveThemeId());
  const editingId = ref<string | undefined>(undefined);
  const draft = ref<Theme | undefined>(undefined);

  const editingTheme = computed(() =>
    themes.value.find((theme) => theme.id === editingId.value),
  );

  const hasUnsavedChanges = computed(
    () =>
      draft.value !== undefined &&
      editingTheme.value !== undefined &&
      !isSameTheme(draft.value, editingTheme.value),
  );

  const toast = (message: string, variant: "success" | "error") =>
    sdk.window.showToast(message, { variant });

  const request = async <T>(promise: Promise<Result<T>>) => {
    const result = await promise.catch((reason: unknown) =>
      error(messageOf(reason)),
    );
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
    const theme = themes.value.find((each) => each.id === id);
    draft.value = theme === undefined ? undefined : { ...theme };
  };

  const closeEditor = () => edit(undefined);

  const updateDraft = (changes: Partial<ThemeContent>) => {
    if (draft.value !== undefined) {
      draft.value = { ...draft.value, ...changes };
    }
  };

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
    const file = await pickThemeFile();
    if (file === undefined) {
      return;
    }

    const text = await file.text().catch(() => undefined);
    if (text === undefined) {
      toast("The file could not be read", "error");
      return;
    }

    const theme = await add(parseJson(text));
    if (theme !== undefined) {
      toast("Theme imported", "success");
    }
  };

  const exportTheme = ({ id: _id, ...content }: Theme) => {
    const result = validateTheme(content);
    if (result.kind === "Error") {
      toast(result.error, "error");
      return;
    }

    downloadTheme(result.value);
  };

  const saveDraft = async () => {
    if (draft.value === undefined) {
      return undefined;
    }

    const { id, ...content } = draft.value;
    const theme = await request(sdk.backend.updateTheme(id, content));
    if (theme !== undefined) {
      await load();
      edit(theme.id);
    }

    return theme;
  };

  const save = async () => {
    const theme = await saveDraft();
    if (theme === undefined) {
      return;
    }

    if (activeThemeId.value === theme.id) {
      apply(theme);
    }
    toast("Theme saved", "success");
  };

  const saveAndApply = async () => {
    const theme = await saveDraft();
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
    draft,
    hasUnsavedChanges,
    load,
    edit,
    closeEditor,
    updateDraft,
    apply,
    restoreActiveTheme,
    turnOff,
    create,
    importFromFile,
    exportTheme,
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
