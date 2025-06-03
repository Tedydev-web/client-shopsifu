"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChangePasswordModal } from "./profile-PasswordUpdate";
import { ProfileUpdateSheet } from "./profile-Update";
import { TwoFactorAuthModal } from "./profile-2FA";

export default function ProfileIndex() {
  const { t } = useTranslation();

  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phoneNumber: "",
    language: "vi",
  });

  const handleEnable2FA = () => {
    // TODO: Call API để bật xác thực 2 bước
    console.log("2FA enabled");
    setIs2FAModalOpen(false);
  };

  return (
    <div className="py-8 space-y-6">
      {/* Thông tin Email & Tên */}
      <div className="border-b pb-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium text-gray-900">{t("user.account.profile.emailPhone")}</p>
            <div className="mt-1 text-sm text-gray-700 space-y-1">
              <p>{userInfo.email}</p>
              <p>{userInfo.phoneNumber || t("user.account.profile.noPhone")}</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setProfileSheetOpen(true)}
            className="bg-orange-500 text-white rounded-full px-4 py-2 w-24 h-10 ml-4"
          >
            {t("user.account.profile.edit")}
          </Button>
        </div>
      </div>

      {/* Đổi mật khẩu */}
      <div className="border-b pb-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium text-gray-900">{t("user.account.profile.password")}</p>
          </div>
          <Button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="bg-orange-500 text-white rounded-full px-4 py-2 w-24 h-10"
          >
            {t("user.account.profile.edit")}
          </Button>
        </div>
      </div>

      {/* Xác thực 2 bước */}
      <div className="border-b pb-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {t("user.account.profile.twoFactor")}: <span className="font-normal">Off</span>
            </p>
            <p className="text-sm text-gray-600">
              {t("user.account.profile.twoFactorDescription")}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setIs2FAModalOpen(true)}
            className="bg-orange-500 text-white rounded-full px-4 py-2 w-24 h-10"
          >
            {t("user.account.profile.turnOn")}
          </Button>
        </div>
      </div>

      {/* Liên kết tài khoản bên thứ ba */}
      <div className="px-4">
        <p className="font-medium text-gray-900">{t("user.account.profile.thirdPartyAccounts")}</p>
        {[{ provider: "Google", status: "Linked" }].map(({ provider, status }) => (
          <div key={provider} className="flex items-center justify-between py-2">
            <div className="flex-1 flex items-center space-x-2">
              {provider === "Google" && (
                <img
                  src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                  alt="Google G logo"
                  className="h-5 w-5"
                />
              )}
              <p className="text-sm text-gray-800">{provider}</p>
            </div>
            <span className="text-orange-500 font-medium w-24 h-10 flex items-center justify-center">
              {status}
            </span>
          </div>
        ))}
      </div>

      {/* Sheet cập nhật thông tin */}
      <ProfileUpdateSheet
        open={profileSheetOpen}
        onOpenChange={setProfileSheetOpen}
        initialData={{
          name: userInfo.name,
          email: userInfo.email,
          language: userInfo.language,
        }}
      />

      {/* Modal đổi mật khẩu */}
      <ChangePasswordModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
        userInfo={userInfo}
      />

      {/* Modal xác thực 2 bước */}
      <TwoFactorAuthModal
        open={is2FAModalOpen}
        onOpenChange={setIs2FAModalOpen}
        onConfirm={handleEnable2FA}
      />
    </div>
  );
}
