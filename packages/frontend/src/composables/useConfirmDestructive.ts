import { useConfirm } from "primevue/useconfirm";

type DestructiveAction = {
  header: string;
  message: string;
  acceptLabel: string;
  accept: () => void;
};

export const useConfirmDestructive = () => {
  const confirm = useConfirm();

  return ({ header, message, acceptLabel, accept }: DestructiveAction) =>
    confirm.require({
      header,
      message,
      accept,
      icon: "fas fa-triangle-exclamation",
      rejectProps: { label: "Cancel", severity: "contrast", text: true },
      acceptProps: { label: acceptLabel, severity: "danger" },
    });
};
