"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChangePasswordModal } from "./profile-MobilePasswordUpdate";
import { ProfileUpdateSheet } from "./profile-MobileUpdate";
import { TwoFactorAuthModal } from "./profile-Mobile2FA";
import { DeleteAccountModal } from "./profile-MobileDeleteAccount";
import AccountLayout from "@/app/(client)/user/layout";

interface ProfileMobileIndexProps {
  title?: string;
}

export default function ProfileMobileIndex({
  title = "user.settings.Account security",
}: ProfileMobileIndexProps) {
  const { t } = useTranslation();

  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [userInfo, setUserInfo] = useState({
    firstName: "Nguyễn",
    lastName: "Văn A",
    userName: "nguyenvana",
    phoneNumber: "",
    avatar: "https://example.com/avatar.jpg",
  });

  const handleEnable2FA = () => {
    console.log("2FA enabled");
    setIs2FAModalOpen(false);
  };

  const handleDeleteAccount = () => {
    console.log("Account deleted");
    setIsDeleteModalOpen(false);
  };

  return (
    <AccountLayout title={t("user.settings.items.Account security")}>
      <div className="px-4 pt-4 pb-8 space-y-4 text-sm text-black bg-white">
        {/* Header status */}
        <div className="flex items-start space-x-3">
          <div className="text-green-600 flex-shrink-0">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 15l-5-5 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
            </svg>
          </div>

          <div className="bg-green-50 rounded-lg p-3 flex-1">
            <div>
              <p className="font-semibold text-green-600">
                {t("user.account.profile.protected")}
              </p>
              <p className="text-xs text-gray-700 leading-tight">
                {t("user.account.profile.protectionDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="flex items-center justify-between border-b py-3">
          <div className="flex flex-col space-y-3">
            <div>
              <p className="text-black font-medium">
                {t("user.account.profile.username")}
              </p>
              <p className="text-gray-700 text-sm mt-1">@{userInfo.userName}</p>
            </div>
            <div>
              <p className="text-black font-medium">
                {t("user.account.profile.phone")}
              </p>
              <p className="text-gray-700 text-sm mt-1">
                {userInfo.phoneNumber || t("user.account.profile.noPhone")}
              </p>
            </div>
            {userInfo.avatar && (
              <div>
                <p className="text-black font-medium">
                  {t("user.account.profile.avatar")}
                </p>
                <div className="mt-1">
                  <img
                    src={userInfo.avatar}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          <Button
            onClick={() => setProfileSheetOpen(true)}
            className="bg-red-600 rounded-full px-4 py-1 h-7 text-xs text-white"
          >
            {t("user.account.profile.edit")}
          </Button>
        </div>

        {/* Password */}
        <div className="flex items-center justify-between border-b py-3">
          <div className="flex flex-col">
            <p className="text-black font-medium">
              {t("user.account.profile.password")}
            </p>
            <p className="text-gray-700 text-sm mt-1">******</p>
            <p className="text-xs text-gray-600 mt-1">
              {t("user.account.profile.passwordQuality")}:{" "}
              <span className="text-red-600 font-medium">Good</span>.{" "}
              {t("user.account.profile.passwordAdvice")}
            </p>
          </div>
          <Button
            onClick={() => setIsPasswordModalOpen(true)}
            className="bg-red-600 rounded-full px-4 py-1 h-7 text-xs text-white"
          >
            {t("user.account.profile.edit")}
          </Button>
        </div>

        {/* 2FA */}
        <div className="flex items-center justify-between border-b py-3">
          <div className="flex flex-col">
            <p className="text-black font-medium">
              {t("user.account.profile.twoFactor")}:{" "}
              <span className="font-normal">Off</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {t("user.account.profile.twoFactorDescription")}
            </p>
          </div>
          <Button
            onClick={() => setIs2FAModalOpen(true)}
            className="bg-red-600 rounded-full px-4 py-1 h-7 text-xs text-white"
          >
            {t("user.account.profile.turnOn")}
          </Button>
        </div>

        {/* Third-party accounts */}
        <div className="border-b pb-4">
          <p className="font-medium text-black mb-3 text-sm">
            {t("user.account.profile.thirdPartyAccounts")}
          </p>
          {[
            { provider: "Google", status: "Linked" },
            { provider: "Facebook", status: "Link" },
          ].map(({ provider, status }) => (
            <div
              key={provider}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center space-x-2">
                {provider === "Google" && (
                  <img
                    src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                    alt="Google logo"
                    className="h-4 w-4"
                  />
                )}
                {provider === "Facebook" && (
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                    alt="Facebook logo"
                    className="h-4 w-4"
                  />
                )}
                <p className="text-sm text-gray-800">{provider}</p>
              </div>
              <span
                className={`text-xs font-medium ${
                  status === "Linked" ? "text-red-600" : "text-red-600"
                }`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>

        {/* Delete Account */}
        <div className="pt-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700 font-medium">
              {t("user.account.profile.deleteAccount")}
            </p>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-red-600 text-sm font-medium hover:underline"
            >
              {t("user.account.profile.delete")}
            </button>
          </div>
        </div>

        {/* Modals */}
        <ProfileUpdateSheet
          open={profileSheetOpen}
          onOpenChange={setProfileSheetOpen}
          initialData={{
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            userName: userInfo.userName,
            phoneNumber: userInfo.phoneNumber,
            avatar: userInfo.avatar,
          }}
        />

        <ChangePasswordModal
          open={isPasswordModalOpen}
          onOpenChange={setIsPasswordModalOpen}
          userInfo={userInfo}
        />

        <TwoFactorAuthModal
          open={is2FAModalOpen}
          onOpenChange={setIs2FAModalOpen}
          onConfirm={handleEnable2FA}
        />

        <DeleteAccountModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={handleDeleteAccount}
        />
      </div>
    </AccountLayout>
  );
}
