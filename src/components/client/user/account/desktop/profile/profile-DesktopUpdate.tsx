"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { SheetRework } from "@/components/ui/component/sheet-rework";
import { useTranslation } from "react-i18next";

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
    <SheetRework
      open={open}
      onOpenChange={onOpenChange}
      title={t("admin.profileUpdate.title")}
      subtitle={t("admin.profileUpdate.subtitle")}
      onCancel={() => onOpenChange(false)}
      onConfirm={handleSubmit}
      confirmText={t("user.account.profile.save")}
      cancelText={t("user.account.profile.cancel")}
    >
      <form className="flex flex-col gap-5">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center space-y-3">
          <div
            className="relative cursor-pointer group"
            onClick={handleAvatarClick}
          >
            {avatar ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden">
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-600">
                  {avatarText}
                </span>
              </div>
            )}
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
            className="text-sm text-blue-500 hover:text-blue-700 hover:underline transition-all"
          >
            {t("user.account.profile.clickToChange")}
          </button>
        </div>

        {/* First Name */}
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
          />
        </div>

        {/* Last Name */}
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
          />
        </div>

        {/* Username */}
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
          />
        </div>

        {/* Phone Number */}
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
          />
        </div>
      </form>
    </SheetRework>
  );
}
