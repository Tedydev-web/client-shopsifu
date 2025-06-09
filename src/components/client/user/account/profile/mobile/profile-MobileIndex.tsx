"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChangePasswordModal } from "./profile-MobilePasswordUpdate";
import { ProfileUpdateSheet } from "./profile-MobileUpdate";
import { TwoFactorAuthModal } from "./profile-Mobile2FA";
import { DeleteAccountModal } from "./profile-MobileDeleteAccount";

export default function ProfileMobileIndex() {
  const { t } = useTranslation();

  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phoneNumber: "",
    language: "vi",
  });

  const handleEnable2FA = () => {
    console.log("2FA enabled");
    setIs2FAModalOpen(false);
  };

  const handleDeleteAccount = () => {
    // TODO: Gọi API xóa tài khoản
    console.log("Account deleted");
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="py-8 space-y-6">
      {/* Email & Tên */}
      <div className="border-b pb-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {t("user.account.profile.emailPhone")}
            </p>
            <div className="mt-1 text-sm text-gray-700 space-y-1">
              <p>{userInfo.email}</p>
              <p>{userInfo.phoneNumber || t("user.account.profile.noPhone")}</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setProfileSheetOpen(true)}
            className="bg-red-600 text-white rounded-full px-4 py-2 w-24 h-10 ml-4"
          >
            {t("user.account.profile.edit")}
          </Button>
        </div>
      </div>

      {/* Đổi mật khẩu */}
      <div className="border-b pb-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {t("user.account.profile.password")}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="bg-red-600 text-white rounded-full px-4 py-2 w-24 h-10"
          >
            {t("user.account.profile.edit")}
          </Button>
        </div>
      </div>

      {/* 2FA */}
      <div className="border-b pb-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {t("user.account.profile.twoFactor")}:{" "}
              <span className="font-normal">Off</span>
            </p>
            <p className="text-sm text-gray-600">
              {t("user.account.profile.twoFactorDescription")}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setIs2FAModalOpen(true)}
            className="bg-red-600 text-white rounded-full px-4 py-2 w-24 h-10"
          >
            {t("user.account.profile.turnOn")}
          </Button>
        </div>
      </div>

      {/* Liên kết tài khoản bên thứ ba */}
      <div>
        <p className="font-medium text-gray-900 text-sm">
          {t("user.account.profile.thirdPartyAccounts")}
        </p>
        {[{ provider: "Google", status: "Linked" }].map(
          ({ provider, status }) => (
            <div
              key={provider}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center space-x-2">
                {provider === "Google" && (
                  <img
                    src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                    alt="Google G logo"
                    className="h-4 w-4"
                  />
                )}
                <p className="text-xs text-gray-800">{provider}</p>
              </div>
              <span className="text-red-600 font-medium text-xs">{status}</span>
            </div>
          )
        )}
      </div>

      {/* Xóa tài khoản */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-700 font-medium">
            {t("user.account.profile.accountTermination")}
          </p>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-600 text-xs font-medium hover:underline"
          >
            {t("user.account.profile.deleteAccount")}
          </button>
        </div>
      </div>

      {/* Modals */}
      <ProfileUpdateSheet
        open={profileSheetOpen}
        onOpenChange={setProfileSheetOpen}
        initialData={{
          name: userInfo.name,
          email: userInfo.email,
          language: userInfo.language,
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
  );
}
