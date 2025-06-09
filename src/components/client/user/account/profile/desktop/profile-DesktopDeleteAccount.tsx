"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteAccountModal({ open, onOpenChange, onConfirm }: DeleteAccountModalProps) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          {t("user.account.profile.deleteAccount")}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {t("user.account.profile.deleteAccountDescription")}
        </p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("user.account.profile.cancel")}
          </Button>
          <Button
            className="bg-red-600 text-white"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {t("user.account.profile.confirmDelete")}
          </Button>
        </div>
      </div>
    </div>
  );
}
