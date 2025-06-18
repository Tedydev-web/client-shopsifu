"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Camera, User, X } from "lucide-react";
import Image from "next/image";

interface ProfileUpdateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    avatar: string;
  };
}

export function ProfileUpdateSheet({
  open,
  onOpenChange,
  initialData,
}: ProfileUpdateSheetProps) {
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [userName, setUserName] = useState(initialData.username);
  const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber);
  const [avatar, setAvatar] = useState(initialData.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleSubmit = () => {
    // handle save here
    onOpenChange(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const avatarText = userName ? userName[0].toUpperCase() : "U";

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="h-[100vh] mx-auto w-full max-w-sm">
          <DrawerHeader className="relative">
            <div className="flex items-center gap-2">
              <DrawerTitle className="text-xl font-semibold">
                {t("user.account.profile.updateProfile")}
              </DrawerTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </DrawerHeader>

          <div className="p-4 space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-3">
              <div
                className="relative cursor-pointer group"
                onClick={handleAvatarClick}
              >
                {avatar ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    {" "}
                    {/* Increased from w-20 h-20 */}
                    <Image
                      src={avatar}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    {" "}
                    {/* Increased from w-20 h-20 */}
                    <span className="text-3xl font-semibold text-gray-600">
                      {" "}
                      {/* Increased from text-2xl */}
                      {avatarText}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={handleAvatarClick}
                className="text-sm text-blue-500 hover:text-blue-700 hover:underline-offset-2  transition-colors"
              >
                {t("user.account.profile.clickToChange")}
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
            <div className="flex justify-end">
              <Button
                className="bg-red-600 text-white w-full"
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
