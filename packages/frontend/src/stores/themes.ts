import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Theme } from "shared";

import { useSDK } from "@/stores/sdk";
import { deactivateTheme, getActiveThemeId } from "@/themes/activeTheme";
import { handleResult } from "@/utils/api-calls";

const THEMES_QUERY_KEY = ["themes"];

export const useThemes = () => {
  const sdk = useSDK();

  return useQuery({
    queryKey: THEMES_QUERY_KEY,
    queryFn: () => handleResult(sdk.backend.getThemes(), sdk),
  });
};

const useThemesMutation = <TInput, TOutput>(
  mutationFn: (input: TInput) => Promise<TOutput>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: THEMES_QUERY_KEY }),
  });
};

export const useAddTheme = () => {
  const sdk = useSDK();
  return useThemesMutation((input: unknown) =>
    handleResult(sdk.backend.addTheme(input), sdk),
  );
};

export const useUpdateTheme = () => {
  const sdk = useSDK();
  return useThemesMutation(({ id, ...content }: Theme) =>
    handleResult(sdk.backend.updateTheme(id, content), sdk),
  );
};

export const useRemoveTheme = () => {
  const sdk = useSDK();
  return useThemesMutation(async (id: string) => {
    await handleResult(sdk.backend.removeTheme(id), sdk);
    if (getActiveThemeId() === id) {
      deactivateTheme();
    }
  });
};

export const useResetThemes = () => {
  const sdk = useSDK();
  return useThemesMutation(async () => {
    await handleResult(sdk.backend.resetThemes(), sdk);
    deactivateTheme();
  });
};
