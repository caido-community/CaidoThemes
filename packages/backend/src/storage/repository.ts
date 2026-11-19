import { randomUUID } from "crypto";
import type { Database } from "sqlite";

import {
  migrateTheme,
  parseJson,
  PRESETS,
  type Theme,
  type ThemeContent,
} from "shared";

import { queryAll, queryOne, run } from "./sql";

export const THEMES_TABLE = "themes_v2";

type ThemeRow = {
  id: string;
  data: string;
};

export const toTheme = (id: string, stored: unknown): Theme | undefined => {
  const content = migrateTheme(stored);
  return content === undefined ? undefined : { id, ...content };
};

const fromRow = ({ id, data }: ThemeRow) => toTheme(id, parseJson(data));

const toRow = ({ id, ...content }: Theme) => [id, JSON.stringify(content)];

const placeholders = (count: number, placeholder: string) =>
  Array.from({ length: count }, () => placeholder).join(", ");

export const createThemeRepository = (db: Database) => {
  const list = async () => {
    const rows = await queryAll<ThemeRow>(
      db,
      `SELECT id, data FROM ${THEMES_TABLE} ORDER BY rowid`,
    );
    return rows.flatMap((row) => fromRow(row) ?? []);
  };

  const get = async (id: string) => {
    const row = await queryOne<ThemeRow>(
      db,
      `SELECT id, data FROM ${THEMES_TABLE} WHERE id = ?`,
      id,
    );
    return row === undefined ? undefined : fromRow(row);
  };

  const save = async (theme: Theme) => {
    await run(
      db,
      `INSERT INTO ${THEMES_TABLE} (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data`,
      ...toRow(theme),
    );
  };

  const create = async (content: ThemeContent) => {
    const theme = { id: randomUUID(), ...content };
    await save(theme);
    return theme;
  };

  const remove = async (id: string) => {
    await run(db, `DELETE FROM ${THEMES_TABLE} WHERE id = ?`, id);
  };

  const reset = async () => {
    const presets = PRESETS.map((preset) => ({ id: randomUUID(), ...preset }));
    const ids = presets.map(({ id }) => id);

    await run(
      db,
      `INSERT INTO ${THEMES_TABLE} (id, data) VALUES ${placeholders(presets.length, "(?, ?)")}`,
      ...presets.flatMap(toRow),
    );
    await run(
      db,
      `DELETE FROM ${THEMES_TABLE} WHERE id NOT IN (${placeholders(ids.length, "?")})`,
      ...ids,
    );
  };

  return { list, get, save, create, remove, reset };
};

export type ThemeRepository = ReturnType<typeof createThemeRepository>;
