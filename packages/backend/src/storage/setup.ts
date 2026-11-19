import type { Database } from "sqlite";

import {
  createThemeRepository,
  THEMES_TABLE,
  type ThemeRepository,
  toTheme,
} from "./repository";
import { queryAll, queryOne } from "./sql";

const SCHEMA_VERSION = 2;
const LEGACY_TABLE = "themes";
const LEGACY_BACKUP_TABLE = "themes_v1";

type LegacyRow = {
  id: string;
  name: string;
  description: string | null;
  author: string | null;
  primary_dark: string | null;
  primary_light: string | null;
  primary_subtle: string | null;
  button_primary_bg: string | null;
  button_primary_text: string | null;
  button_secondary_bg: string | null;
  button_secondary_text: string | null;
  button_tertiary_bg: string | null;
  button_tertiary_text: string | null;
};

const toLegacyTheme = (row: LegacyRow) => ({
  name: row.name,
  description: row.description,
  author: row.author,
  primary: {
    dark: row.primary_dark,
    light: row.primary_light,
    subtle: row.primary_subtle,
  },
  button: {
    primary: { bg: row.button_primary_bg, text: row.button_primary_text },
    secondary: { bg: row.button_secondary_bg, text: row.button_secondary_text },
    tertiary: { bg: row.button_tertiary_bg, text: row.button_tertiary_text },
  },
});

const tableExists = async (db: Database, name: string) => {
  const row = await queryOne(
    db,
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    name,
  );
  return row !== undefined;
};

const migrateLegacyThemes = async (
  db: Database,
  repository: ThemeRepository,
) => {
  const rows = await queryAll<LegacyRow>(
    db,
    `SELECT * FROM ${LEGACY_TABLE} ORDER BY rowid`,
  );

  for (const row of rows) {
    const theme = toTheme(row.id, toLegacyTheme(row));
    if (theme !== undefined) {
      await repository.save(theme);
    }
  }

  const hasBackup = await tableExists(db, LEGACY_BACKUP_TABLE);
  await db.exec(
    hasBackup
      ? `DROP TABLE ${LEGACY_TABLE}`
      : `ALTER TABLE ${LEGACY_TABLE} RENAME TO ${LEGACY_BACKUP_TABLE}`,
  );
};

const schemaVersion = async (db: Database) => {
  const row = await queryOne<{ user_version: number }>(
    db,
    "PRAGMA user_version",
  );
  return row?.user_version ?? 0;
};

export const setupThemeStorage = async (db: Database) => {
  const isSetUp = (await schemaVersion(db)) >= SCHEMA_VERSION;

  await db.exec(
    `CREATE TABLE IF NOT EXISTS ${THEMES_TABLE} (id TEXT PRIMARY KEY, data TEXT NOT NULL)`,
  );

  const repository = createThemeRepository(db);

  if (await tableExists(db, LEGACY_TABLE)) {
    await migrateLegacyThemes(db, repository);
  } else if (!isSetUp && (await repository.list()).length === 0) {
    await repository.reset();
  }

  await db.exec(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  return repository;
};
