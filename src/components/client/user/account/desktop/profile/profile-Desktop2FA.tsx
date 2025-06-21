"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone } from "lucide-react";
import Link from "next/link";

interface TwoFactorAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEnabled: boolean;
  showRegenerateConfirm: boolean;
  setShowRegenerateConfirm: (open: boolean) => void;
  handleRegenerateRecoveryCodes: (code: string) => void;
  show2FADialog: boolean
  setShow2FADialog: (open: boolean) => void
  showQRDialog: boolean
  setShowQRDialog: (open: boolean) => void
  showRecoveryCodesDialog?: boolean
  setShowRecoveryCodesDialog?: (open: boolean) => void
  is2FAEnabled: boolean
  loading?: boolean
  qrCodeImage: string
  secret: string
  recoveryCodes?: string[]
  Code: string
  setCode: (code: string) => void
  onConfirm2FA: () => void
  onConfirmSetup: () => void
  copyAllRecoveryCodes?: () => void
  downloadRecoveryCodes?: () => void
  t: (key: string) => string
}

export function TwoFactorAuthModal({ 
  open, 
  onOpenChange, 
  isEnabled,
  show2FADialog,
  setShow2FADialog,
  showQRDialog,
  setShowQRDialog,
  showRecoveryCodesDialog = false,
  setShowRecoveryCodesDialog = () => {},
  is2FAEnabled,
  loading = false,
  qrCodeImage,
  secret,
  recoveryCodes = [],
  Code,
  setCode,
  onConfirm2FA,
  onConfirmSetup,
  copyAllRecoveryCodes = () => {},
  downloadRecoveryCodes = () => {},
  t,
  showRegenerateConfirm,
  setShowRegenerateConfirm,
  handleRegenerateRecoveryCodes,
}: TwoFactorAuthModalProps) {
  return (
    <>
      {/* Regenerate Recovery Codes Dialog */}
      <Dialog open={showRegenerateConfirm} onOpenChange={setShowRegenerateConfirm}>
        <DialogContent className="max-w-lg   rounded-xl p-0 overflow-hidden">
          <div className="px-8 pt-8 pb-2">
            <DialogTitle className="text-2xl font-bold mb-1">
              {t('admin.profileSettings.regenerateCodesTitle')}
            </DialogTitle>
            <DialogDescription className="text-gray-300 mb-4">
              {t('admin.profileSettings.regenerateCodesDescription')}
              <div className="mt-4">
                <Label htmlFor="regenerate-2fa-code" className="">
                  {t('admin.profileSettings.QrCode.6code')}
                </Label>
                <Input
                  id="regenerate-2fa-code"
                  className=" border-gray-300  font-mono text-lg w-40 mt-1"
                  maxLength={6}
                  value={Code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="000000"
                />
              </div>
            </DialogDescription>
          </div>
          <div className="px-8 pb-8 flex justify-end gap-2">
            {/* <Button 
              variant="outline" 
              onClick={() => setShowRegenerateConfirm(false)} 
              className="bg-[#383c44] hover:bg-[#4c505a] "
              disabled={loading}
            >
              {t('admin.profileSettings.cancel')}
            </Button> */}
            <Button 
              onClick={() => handleRegenerateRecoveryCodes(Code)}
              className="bg-red-600 hover:bg-red-700 " 
              disabled={loading || Code.length !== 6}
            >
              {loading ? t('admin.profileSettings.processing') : t('admin.profileSettings.confirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main 2FA Dialog */}
      <Dialog open={open && show2FADialog} onOpenChange={(value) => {
        setShow2FADialog(value);
        onOpenChange(value);
      }}>
        <DialogContent className="max-w-lg rounded-xl p-0 overflow-hidden">
          <div className="px-8 pt-8 pb-2">
            <DialogTitle className="text-2xl font-bold mb-1">
              {is2FAEnabled 
                ? t('admin.profileSettings.disable2FATitle') 
                : t('admin.profileSettings.enable2FATitle')}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mb-4">
              {is2FAEnabled ? (
                <>
                  <p>{t('admin.profileSettings.disable2FADescription')}</p>
                  <div className="mt-4">
                    <Label htmlFor="2fa-code" className="">
                      {t('admin.profileSettings.QrCode.6code')}
                    </Label>
                    <Input
                      id="2fa-code"
                      className=" border-gray-300  font-mono text-lg w-40 mt-1"
                      maxLength={6}
                      value={Code}
                      onChange={e => setCode(e.target.value)}
                      placeholder="000000"
                    />
                  </div>
                </>
              ) : (
                t('admin.profileSettings.enable2FADescription')
              )}
            </DialogDescription>
          </div>
          <div className="px-8 pb-8 flex justify-end gap-2">
            {/* <Button 
              variant="outline" 
              onClick={() => setShow2FADialog(false)}
              className="bg-[#383c44] hover:bg-[#4c505a] " 
              disabled={loading}
            >
              {t('admin.profileSettings.cancel')}
            </Button> */}
            <Button
              onClick={onConfirm2FA}
              className="bg-red-600 hover:bg-red-700 "
              disabled={loading || (is2FAEnabled && Code.length !== 6)}
            >
              {loading 
                ? t('admin.profileSettings.processing')
                : is2FAEnabled 
                  ? t('admin.profileSettings.disable')
                  : t('admin.profileSettings.enable')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recovery Codes Dialog */}
      <Dialog open={showRecoveryCodesDialog} onOpenChange={setShowRecoveryCodesDialog}>
        <DialogContent className="max-w-lg   rounded-xl p-0 overflow-hidden">
          <div className="px-8 pt-8 pb-2">
            <DialogTitle className="text-2xl font-bold mb-1">
              {t("admin.profileSettings.QrCode.title")}
            </DialogTitle>
            <DialogDescription className="text-gray-300 mb-4">
              {t("admin.profileSettings.QrCode.description")}
            </DialogDescription>
          </div>

          <div className="px-8 pb-8">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {recoveryCodes?.map((code, idx) => (
                  <div
                    key={idx}
                    className=" rounded px-3 py-2 font-mono text-base select-all text-center"
                  >
                    {code}
                  </div>
                ))}
              </div>

              <div className="bg-red-900/30 border border-red-500/30 rounded-md p-3 text-sm text-red-300 mb-4">
                <p>{t("admin.profileSettings.QrCode.email")}</p>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={copyAllRecoveryCodes}
                  className="bg-[#383c44] hover:bg-[#4c505a]  flex-1"
                >
                  {t("admin.profileSettings.QrCode.copy")}
                </Button>
                <Button
                  onClick={downloadRecoveryCodes}
                  className="bg-[#383c44] hover:bg-[#4c505a]  flex-1"
                >
                  {t("admin.profileSettings.QrCode.download")}
                </Button>
              </div>
            </div>

            <Button
              onClick={() => setShowRecoveryCodesDialog(false)}
              className="w-full bg-red-600 hover:bg-red-700 "
            >
              {t("admin.profileSettings.QrCode.done")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-lg   rounded-xl p-0 overflow-hidden">
          <div className="px-8 pt-8 pb-2">
            <DialogTitle className="text-2xl font-bold mb-1">
              {t("admin.profileSettings.QrCode.title2fa")}
            </DialogTitle>
            <DialogDescription className="text-gray-300 mb-4">
              {t("admin.profileSettings.QrCode.description2fa")}
            </DialogDescription>
          </div>
          
          <div className="px-8 pb-8">
            {/* Step 1: Download App */}
            <div className="flex items-center gap-4 mb-6">
              <Smartphone className="w-10 h-10 text-gray-400" />
              <div>
                <div className="font-semibold ">
                  {t("admin.profileSettings.QrCode.downloadAuth")}
                </div>
                <div className="text-gray-300 text-sm">
                  {t("admin.profileSettings.QrCode.downloadSetup")}{" "}
                  <Link href="https://authy.com/" target="_blank" className="underline text-red-400">
                    Authy
                  </Link>{" "}
                  {t("admin.profileSettings.QrCode.or")}{" "}
                  <Link
                    href="https://support.google.com/accounts/answer/1066447"
                    target="_blank"
                    className="underline text-red-400"
                  >
                    Google Authenticator
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 2: QR Code */}
            <div className="mb-6">
              <div className="font-semibold mb-2">{t("admin.profileSettings.QrCode.qr")}</div>
              <div className="flex flex-col items-center">
                {qrCodeImage ? (
                  <img src={qrCodeImage} alt="QR Code" width={160} height={160} />
                ) : (
                  <QRCodeSVG value={secret || "placeholder"} size={160} />
                )}
              </div>
              <div className="text-gray-300 text-sm mt-2">
                {t("admin.profileSettings.QrCode.openQr")}
              </div>
            </div>

            {/* Step 3: Secret Key */}
            <div className="mb-6">
              <div className="font-semibold mb-2">{t("admin.profileSettings.QrCode.secret")}</div>
              <div className=" rounded-md px-4 py-3 font-mono text-lg tracking-widest text-red-300 select-all break-all">
                {secret}
              </div>
            </div>

            {/* Verification Code Input */}
            <div className="mb-2">
              <div className="font-semibold mb-2">{t("admin.profileSettings.QrCode.confirm")}</div>
              <div className="text-gray-300 text-sm mb-2">
                {t("admin.profileSettings.QrCode.6code")}
              </div>
              <div className="flex gap-2">
                <Input
                  className=" border-gray-300 font-mono text-lg w-40"
                  maxLength={6}
                  value={Code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="000000"
                />
                <Button
                  className="bg-red-600 hover:bg-red-700 font-semibold"
                  disabled={loading || Code.length !== 6}
                  onClick={onConfirmSetup}
                >
                  {loading 
                    ? t("admin.profileSettings.QrCode.authen") 
                    : t("admin.profileSettings.QrCode.2fa")}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}