import type { Result } from "shared";

import type { CaidoSDK } from "@/types";

export async function handleResult<T>(
  promise: Promise<Result<T>>,
  sdk: CaidoSDK,
) {
  const result = await promise;

  if (result.kind === "Error") {
    sdk.window.showToast(result.error, { variant: "error" });
    throw new Error(result.error);
  }

  return result.value;
}
