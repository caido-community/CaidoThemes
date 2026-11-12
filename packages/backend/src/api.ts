import type { SDK } from "caido:plugin";
import { error, migrateTheme, ok, validateTheme } from "shared";

import type { ThemeRepository } from "./storage/repository";

export const createThemesApi = (repository: ThemeRepository) => ({
  getThemes: async (_sdk: SDK) => ok(await repository.list()),

  getTheme: async (_sdk: SDK, id: string) => {
    const theme = await repository.get(id);
    return theme === undefined ? error(`Theme ${id} not found`) : ok(theme);
  },

  addTheme: async (_sdk: SDK, input: unknown) => {
    const content = migrateTheme(input);
    if (content === undefined) {
      return error("This is not a valid theme");
    }

    return ok(await repository.create(content));
  },

  updateTheme: async (_sdk: SDK, id: string, input: unknown) => {
    const content = validateTheme(input);
    if (content.kind === "Error") {
      return error(content.error);
    }

    if ((await repository.get(id)) === undefined) {
      return error(`Theme ${id} not found`);
    }

    const theme = { id, ...content.value };
    await repository.save(theme);
    return ok(theme);
  },

  removeTheme: async (_sdk: SDK, id: string) => {
    await repository.remove(id);
    return ok(id);
  },

  resetThemes: async (_sdk: SDK) => {
    await repository.reset();
    return ok(await repository.list());
  },
});

export type ThemesApi = ReturnType<typeof createThemesApi>;
