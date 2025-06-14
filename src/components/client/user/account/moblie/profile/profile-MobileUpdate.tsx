"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface ProfileUpdateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    firstName: string;
    lastName: string;
    userName: string;
    phoneNumber: string;
    avatar: string;
  };
}

export function ProfileUpdateSheet({ open, onOpenChange, initialData }: ProfileUpdateSheetProps) {
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [userName, setUserName] = useState(initialData.userName);
  const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber);
  const { t } = useTranslation();

  const handleSubmit = () => {
    // handle save here
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="h-[100vh] mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-semibold">
              {t("user.account.profile.updateProfile")}
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-4 space-y-4">
            <form className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("user.account.profile.firstName")}
                </label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoFocus
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("user.account.profile.lastName")}
                </label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("user.account.profile.username")}
                </label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("user.account.profile.phone")}
                </label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                  className="w-full"
                />
              </div>
            </form>
          </div>

          <DrawerFooter className="border-t">
            <div className="flex justify-end gap-2">
              <DrawerClose asChild>
                <Button variant="outline">
                  {t("user.account.profile.cancel")}
                </Button>
              </DrawerClose>
              <Button
                className="bg-red-600 text-white"
                onClick={handleSubmit}
              >
                {t("user.account.profile.save")}
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}