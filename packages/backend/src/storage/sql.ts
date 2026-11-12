import type { Database, Parameter } from "sqlite";

export const queryAll = async <T extends object>(
  db: Database,
  sql: string,
  ...params: Parameter[]
) => (await db.prepare(sql)).all<T>(...params);

export const queryOne = async <T extends object>(
  db: Database,
  sql: string,
  ...params: Parameter[]
) => (await db.prepare(sql)).get<T>(...params);

export const run = async (db: Database, sql: string, ...params: Parameter[]) =>
  (await db.prepare(sql)).run(...params);
