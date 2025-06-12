"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface TwoFactorAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function TwoFactorAuthModal({ open, onOpenChange, onConfirm }: TwoFactorAuthModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("user.account.profile.enable2FA")}</DialogTitle>
          <DialogDescription>
            {t("user.account.profile.enable2FADescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("user.account.profile.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("user.account.profile.enable")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
