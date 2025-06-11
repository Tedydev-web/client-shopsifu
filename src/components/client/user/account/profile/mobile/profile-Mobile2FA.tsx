"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface TwoFactorAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function TwoFactorAuthModal({ open, onOpenChange, onConfirm }: TwoFactorAuthModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px] p-4 rounded-xl">
        <DialogHeader className="flex justify-between items-center border-b pb-2">
          <DialogTitle className="text-lg font-semibold">
            {t("user.account.profile.enable2FA")}
          </DialogTitle>
          <DialogClose className="text-gray-500 hover:text-gray-700" />
        </DialogHeader>
        <div className="py-3 space-y-4">
          <p className="text-sm text-gray-600">
            {t("user.account.profile.enable2FADescription")}
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("user.account.profile.cancel")}
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              {t("user.account.profile.enable")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}