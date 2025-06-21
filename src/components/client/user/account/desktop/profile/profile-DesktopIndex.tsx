"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChangePasswordModal } from "./profile-DesktopPasswordUpdate";
import { ProfileUpdateSheet } from "./profile-DesktopUpdate";
import { TwoFactorAuthModal } from "./profile-Desktop2FA";
import { DeleteAccountModal } from "./profile-DesktopDeleteAccount";
import AccountLayout from "@/app/(client)/user/layout";
import { useUserData } from "@/hooks/useGetData-UserLogin";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { usePasswordSecurity } from "../../profile/useProfile-2FA";

export default function ProfileDesktopIndex() {
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
    <AccountLayout
      title={t("user.settings.items.Account security")}
      showSidebar={false}
    >
      <div className="py-8 space-y-6">
        {/* User Information */}
        <div className="border-b pb-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-100 shadow-sm" // Increased size and added border
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-100 shadow-sm">
                    <span className="text-3xl font-semibold text-gray-600">
                      {" "}
                      {/* Increased font size */}
                      {avatarText}
                    </span>
                  </div>
                )}
              </div>

              {/* User Details */}
              <div className="flex-1 ml-6">
                <p className="text-sm font-semibold text-green-700">
                  {t("user.account.profile.protected")}
                </p>
                <div className="mt-1 text-sm text-gray-700 space-y-1">
                  {/* Full Name */}
                  {(firstName || lastName) && (
                    <p>{[firstName, lastName].filter(Boolean).join(" ")}</p>
                  )}
                  {/* Username */}
                  <p>@{name}</p>
                  {/* Phone Number */}
                  <p>{phoneNumber || t("user.account.profile.noPhone")}</p>
                </div>
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
                <span className="font-normal">
                  {t(`user.account.profile.${user.twoFactorEnabled ? "on" : "off"}`)}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                {t("user.account.profile.twoFactorDescription")}
              </p>
            </div>
            <Button
              type="button"
              onClick={() => {
                setIs2FAModalOpen(true);
                setShow2FADialog(true);
              }}
              className="bg-red-600 text-white rounded-full px-4 py-2 w-24 h-10"
            >
              {t(`user.account.profile.${user.twoFactorEnabled ? "turnOff" : "turnOn"}`)}
            </Button>
          </div>
        </div>

        {/* Liên kết tài khoản bên thứ ba */}
        <div className="px-4">
          <p className="font-medium text-gray-900">
            {t("user.account.profile.thirdPartyAccounts")}
          </p>
          {[{ provider: "Google", status: "Linked" }].map(
            ({ provider, status }) => (
              <div
                key={provider}
                className="flex items-center justify-between py-2"
              >
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
                <span className="text-red-600 font-medium w-24 h-10 flex items-center justify-center">
                  {status}
                </span>
              </div>
            )
          )}
        </div>

        {/* Account Termination Section */}
        <div className="border-t pt-6 px-4 flex items-center justify-between">
          <p className="text-sm text-gray-700 font-medium">
            {t("user.account.profile.accountTermination")}
          </p>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-600 text-sm font-medium hover:underline"
          >
            {t("user.account.profile.deleteAccount")}
          </button>
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
