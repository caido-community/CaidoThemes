type Failure = { kind: "Error"; error: string };
type Success<T> = { kind: "Success"; value: T };

export type Result<T> = Failure | Success<T>;

export const ok = <T>(value: T): Success<T> => ({ kind: "Success", value });

export const error = (message: string): Failure => ({
  kind: "Error",
  error: message,
});
