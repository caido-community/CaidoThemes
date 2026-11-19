/// <reference types="node" />
import { DatabaseSync } from "node:sqlite";

import { PRESETS } from "shared";
import type { Database, Parameter } from "sqlite";
import { describe, expect, it } from "vitest";

import { createThemeRepository } from "./repository";
import { setupThemeStorage } from "./setup";

const LEGACY_SCHEMA = `
  CREATE TABLE themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    author TEXT,
    primary_dark TEXT,
    primary_light TEXT,
    primary_subtle TEXT,
    button_primary_bg TEXT,
    button_primary_text TEXT,
    button_secondary_bg TEXT,
    button_secondary_text TEXT,
    button_tertiary_bg TEXT,
    button_tertiary_text TEXT
  )
`;

const failOnInsert = (sql: string) => sql.startsWith("INSERT");

const adapt = (
  sqlite: DatabaseSync,
  failWhen: (sql: string) => boolean = () => false,
) => {
  const db = {
    exec: async (sql: string) => sqlite.exec(sql),
    prepare: async (sql: string) => {
      if (failWhen(sql)) {
        throw new Error("Simulated database failure");
      }

      const statement = sqlite.prepare(sql);
      return {
        all: async (...params: Parameter[]) => statement.all(...params),
        get: async (...params: Parameter[]) => statement.get(...params),
        run: async (...params: Parameter[]) => statement.run(...params),
      };
    },
  };

  return db as unknown as Database;
};

const createDatabase = () => {
  const sqlite = new DatabaseSync(":memory:");
  return { db: adapt(sqlite), sqlite };
};

const insertLegacyTheme = (
  sqlite: DatabaseSync,
  id: string,
  name: string,
  [dark, light, subtle]: [string, string, string],
  buttonPrimaryBg: string | null = null,
) => {
  sqlite
    .prepare(
      `INSERT INTO themes (id, name, description, author, primary_dark, primary_light, primary_subtle, button_primary_bg)
       VALUES (?, ?, 'A description', 'someone', ?, ?, ?, ?)`,
    )
    .run(id, name, dark, light, subtle, buttonPrimaryBg);
};

type TableRow = { name: string };

const tableNames = (sqlite: DatabaseSync) => {
  const rows = sqlite
    .prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
    )
    .all() as TableRow[];

  return rows.map((row) => row.name);
};

describe("setupThemeStorage", () => {
  it("adds the presets on the first launch", async () => {
    const { db } = createDatabase();

    const repository = await setupThemeStorage(db);
    const themes = await repository.list();

    expect(themes.map((theme) => theme.name)).toEqual(
      PRESETS.map((preset) => preset.name),
    );
  });

  it("migrates every legacy theme and keeps its id", async () => {
    const { db, sqlite } = createDatabase();
    sqlite.exec(LEGACY_SCHEMA);
    insertLegacyTheme(
      sqlite,
      "custom-id",
      "Mine",
      ["#101010", "#303030", "#202020"],
      "#aa0000",
    );
    insertLegacyTheme(sqlite, "ocean-id", "Ocean Blue", [
      "#1a2b3c",
      "#3a5a7a",
      "#2c4a6a",
    ]);

    const repository = await setupThemeStorage(db);

    expect(await repository.get("custom-id")).toEqual({
      id: "custom-id",
      version: 2,
      name: "Mine",
      description: "A description",
      author: "someone",
      tokens: {
        "--color-surface-page": { dark: "#101010" },
        "--color-surface-subtle": { dark: "#202020" },
        "--color-surface-raised": { dark: "#303030" },
        "--color-fill-primary": { dark: "#aa0000" },
      },
    });
    expect(await repository.get("ocean-id")).toEqual({
      id: "ocean-id",
      ...PRESETS.find((preset) => preset.name === "Ocean Blue"),
      description: "A description",
      author: "someone",
    });
  });

  it("keeps the legacy rows as a backup", async () => {
    const { db, sqlite } = createDatabase();
    sqlite.exec(LEGACY_SCHEMA);
    insertLegacyTheme(sqlite, "custom-id", "Mine", [
      "#101010",
      "#303030",
      "#202020",
    ]);

    await setupThemeStorage(db);

    expect(tableNames(sqlite)).toEqual(["themes_v1", "themes_v2"]);
    expect(sqlite.prepare("SELECT id FROM themes_v1").all()).toEqual([
      { id: "custom-id" },
    ]);
  });

  it("does not migrate or add presets twice", async () => {
    const { db, sqlite } = createDatabase();
    sqlite.exec(LEGACY_SCHEMA);
    insertLegacyTheme(sqlite, "custom-id", "Mine", [
      "#101010",
      "#303030",
      "#202020",
    ]);

    await setupThemeStorage(db);
    const repository = await setupThemeStorage(db);

    expect(await repository.list()).toHaveLength(1);
  });

  it("does not add presets when the user had deleted every theme", async () => {
    const { db, sqlite } = createDatabase();
    sqlite.exec(LEGACY_SCHEMA);

    const repository = await setupThemeStorage(db);

    expect(await repository.list()).toEqual([]);
  });

  it("migrates a legacy table created again after a downgrade", async () => {
    const { db, sqlite } = createDatabase();
    sqlite.exec(LEGACY_SCHEMA);
    await setupThemeStorage(db);
    sqlite.exec(LEGACY_SCHEMA);
    insertLegacyTheme(sqlite, "late-id", "Late", [
      "#101010",
      "#303030",
      "#202020",
    ]);

    const repository = await setupThemeStorage(db);

    expect(await repository.get("late-id")).toMatchObject({ name: "Late" });
    expect(tableNames(sqlite)).toEqual(["themes_v1", "themes_v2"]);
  });

  it("keeps the position of a theme when it is updated", async () => {
    const { db } = createDatabase();
    const repository = await setupThemeStorage(db);
    const [first] = await repository.list();

    await repository.save({ ...first!, name: "Renamed" });

    expect((await repository.list())[0]).toMatchObject({ name: "Renamed" });
  });

  it("adds the presets on the next launch when the first one failed", async () => {
    const sqlite = new DatabaseSync(":memory:");
    await expect(
      setupThemeStorage(adapt(sqlite, failOnInsert)),
    ).rejects.toThrow();

    const repository = await setupThemeStorage(adapt(sqlite));

    expect(await repository.list()).toHaveLength(PRESETS.length);
  });

  it("does not add the presets again after the user deleted every theme", async () => {
    const { db, sqlite } = createDatabase();
    await setupThemeStorage(db);
    sqlite.exec("DELETE FROM themes_v2");

    const repository = await setupThemeStorage(db);

    expect(await repository.list()).toEqual([]);
  });
});

describe("resetting themes", () => {
  it("replaces every theme with the presets", async () => {
    const { db } = createDatabase();
    const repository = await setupThemeStorage(db);
    await repository.create({ ...PRESETS[0]!, name: "Mine" });

    await repository.reset();

    expect((await repository.list()).map((theme) => theme.name)).toEqual(
      PRESETS.map((preset) => preset.name),
    );
  });

  it("keeps the current themes when the presets cannot be added", async () => {
    const { db, sqlite } = createDatabase();
    const repository = await setupThemeStorage(db);
    await repository.create({ ...PRESETS[0]!, name: "Mine" });
    const before = await repository.list();

    const failing = createThemeRepository(adapt(sqlite, failOnInsert));
    await expect(failing.reset()).rejects.toThrow();

    expect(await repository.list()).toEqual(before);
  });
});
