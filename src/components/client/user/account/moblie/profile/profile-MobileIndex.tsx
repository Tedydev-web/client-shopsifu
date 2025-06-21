"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChangePasswordModal } from "./profile-MobilePasswordUpdate";
import { ProfileUpdateSheet } from "./profile-MobileUpdate";
import { TwoFactorAuthModal } from "./profile-Mobile2FA";
import { DeleteAccountModal } from "./profile-MobileDeleteAccount";
import AccountLayout from "@/app/(client)/user/layout";
import { useUserData } from "@/hooks/useGetData-UserLogin";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { usePasswordSecurity } from "../../profile/useProfile-2FA";

interface ProfileMobileIndexProps {
  title?: string;
}

export default function ProfileMobileIndex({}: ProfileMobileIndexProps) {
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();
  const user = useUserData();
  const {
      is2FAEnabled,
      show2FADialog,
      setShow2FADialog,
      showQRDialog,
      setShowQRDialog,
      showRecoveryCodesDialog,
      setShowRecoveryCodesDialog,
      qrCodeImage,
      secret,
      loading,
      Code,
      setCode,
      recoveryCodes,
      handle2FAToggle,
      handleConfirm2FA,
      handleConfirmSetup,
      handleRegenerateClick,
      handleRegenerateRecoveryCodes,
      showRegenerateConfirm,
      setShowRegenerateConfirm,
      copyAllRecoveryCodes,
      downloadRecoveryCodes,
      t,
    } = usePasswordSecurity({ isEnabled: user?.twoFactorEnabled ?? false });

  const handleEnable2FA = () => {
    console.log("2FA enabled");
    setIs2FAModalOpen(false);
  };

  const handleDeleteAccount = () => {
    console.log("Account deleted");
    setIsDeleteModalOpen(false);
  };

  if (!user) {
    return (
      <span
        onClick={() => router.push(ROUTES.BUYER.SIGNIN)}
        className="cursor-pointer inline-flex items-center justify-center px-4 py-3 text-white font-semibold text-[13px]"
      >
        Đăng nhập
      </span>
    );
  }

  const firstName = user.firstName;
  const lastName = user.lastName;
  const name = user.username;
  const phoneNumber = user.phoneNumber || "";
  const avatar = user.avatar || ""; // Lấy ảnh đại diện từ user, nếu không có thì để trống
  // Tạo avatar từ chữ cái đầu tên nếu không có ảnh
  const avatarText = name ? name[0].toUpperCase() : "U";

  return (
    <AccountLayout title={t("user.settings.items.Account security")}>
      <div className="pb-8 space-y-4 text-sm text-black bg-white">
        {/* Header status */}
        <div className="flex items-center bg-white py-4">
          <div className="flex-shrink-0 flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="text-green-600"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 17.3c-3.02-.86-5-3.73-5-6.8V7.18l5-2.22 5 2.22V11.5c0 3.07-1.98 5.94-5 6.8z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 pr-4 px-1.5">
            <p className="text-sm font-semibold text-green-700">
              {t("user.account.profile.protected")}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {t("user.account.profile.protectionDescription")}
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="flex items-center justify-between border-b py-3">
          <div className="flex flex-col space-y-3">
            {/* Name section */}
            {(firstName || lastName) && (
              <div>
                <p className="text-black font-medium">
                  {t("user.account.profile.name")}
                </p>
                <p className="text-gray-700 text-sm mt-1">
                  {[firstName, lastName].filter(Boolean).join(" ")}
                </p>
              </div>
            )}

            {/* Username section */}
            <div>
              <p className="text-black font-medium">
                {t("user.account.profile.username")}
              </p>
              <p className="text-gray-700 text-sm mt-1">@{name}</p>
            </div>

            {/* Phone section */}
            <div>
              <p className="text-black font-medium">
                {t("user.account.profile.phone")}
              </p>
              <p className="text-gray-700 text-sm mt-1">{phoneNumber}</p>
            </div>
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
              <span className="font-normal">
                {t(
                  `user.account.profile.${user.twoFactorEnabled ? "on" : "off"}`
                )}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {t("user.account.profile.twoFactorDescription")}
            </p>
          </div>
          <Button
            onClick={() => setIs2FAModalOpen(true)}
            className="bg-red-600 rounded-full px-4 py-1 h-7 text-xs text-white"
          >
            {t(
              `user.account.profile.${
                user.twoFactorEnabled ? "turnOff" : "turnOn"
              }`
            )}
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
            firstName,
            lastName,
            username: name,
            phoneNumber,
            avatar,
          }}
        />

        <ChangePasswordModal
          open={isPasswordModalOpen}
          onOpenChange={setIsPasswordModalOpen}
          firstName={firstName || ""} // Match the typo in the interface
          lastName={lastName || ""}
          username={name || ""}
          revokeOtherSessions={false} // Default value, can be changed in the modal
        />

        <TwoFactorAuthModal
          open={is2FAModalOpen}
          onOpenChange={setIs2FAModalOpen}
          isEnabled={user?.twoFactorEnabled ?? false}
          showRegenerateConfirm={showRegenerateConfirm}
          setShowRegenerateConfirm={setShowRegenerateConfirm}
          handleRegenerateRecoveryCodes={handleRegenerateRecoveryCodes}
          show2FADialog={show2FADialog}
          setShow2FADialog={setShow2FADialog}
          showQRDialog={showQRDialog}
          setShowQRDialog={setShowQRDialog}
          showRecoveryCodesDialog={showRecoveryCodesDialog}
          setShowRecoveryCodesDialog={setShowRecoveryCodesDialog}
          is2FAEnabled={is2FAEnabled}
          loading={loading}
          qrCodeImage={qrCodeImage}
          secret={secret}
          recoveryCodes={recoveryCodes}
          Code={Code}
          setCode={setCode}
          onConfirm2FA={handleConfirm2FA}
          onConfirmSetup={handleConfirmSetup}
          copyAllRecoveryCodes={copyAllRecoveryCodes}
          downloadRecoveryCodes={downloadRecoveryCodes}
          t={t}
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
