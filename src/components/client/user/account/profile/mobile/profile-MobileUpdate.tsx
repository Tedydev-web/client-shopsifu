"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface ProfileUpdateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    name: string;
    email: string;
    language: string;
  };
}

export function ProfileUpdateSheet({ open, onOpenChange, initialData }: ProfileUpdateSheetProps) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  const [language, setLanguage] = useState(initialData.language);
  const { t } = useTranslation();

  const handleConfirm = () => {
    // handle save here
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px] p-4 rounded-xl">
        <DialogHeader className="flex justify-between items-center border-b pb-2">
          <DialogTitle className="text-lg font-semibold">
            {t("admin.profileUpdate.title")}
          </DialogTitle>
          <DialogClose className="text-gray-500 hover:text-gray-700" />
        </DialogHeader>
        <div className="py-3 space-y-4">
          <form className="space-y-3">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("admin.profileUpdate.name")}
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="w-full text-sm p-2 border rounded"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full text-sm p-2 border rounded"
              />
            </div>
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("admin.profileUpdate.lang")}
              </label>
              <Input
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-sm p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t("user.account.profile.cancel")}
              </Button>
              <Button
                className="bg-red-600 text-white"
                onClick={handleConfirm}
              >
                {t("user.account.profile.save")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}