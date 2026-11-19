import { useConfirmDestructive } from "@/composables/useConfirmDestructive";
import { useThemesStore } from "@/stores/themes";

export const useDiscardGuard = () => {
  const confirmDestructive = useConfirmDestructive();
  const { draft, hasUnsavedChanges } = useThemesStore();

  return (action: () => void) => {
    if (!hasUnsavedChanges.value) {
      action();
      return;
    }

    confirmDestructive({
      header: "Discard changes?",
      message: `"${draft.value?.name}" has unsaved changes. Discard them?`,
      acceptLabel: "Discard",
      accept: action,
    });
  };
};
