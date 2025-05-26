import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QRCodeSVG } from 'qrcode.react'
import React from 'react'

interface Profile2FAModalProps {
  show2FADialog: boolean
  setShow2FADialog: (open: boolean) => void
  showQRDialog: boolean
  setShowQRDialog: (open: boolean) => void
  is2FAEnabled: boolean
  loading?: boolean
  qrUri: string
  totpCode: string
  setTotpCode: (code: string) => void
  onConfirm2FA: () => void
  onConfirmSetup: () => void
  t: (key: string) => string
}

export function Profile2FAModal({
  show2FADialog,
  setShow2FADialog,
  showQRDialog,
  setShowQRDialog,
  is2FAEnabled,
  loading = false,
  qrUri,
  totpCode,
  setTotpCode,
  onConfirm2FA,
  onConfirmSetup,
  t,
}: Profile2FAModalProps) {
  return (
    <>
      {/* 2FA Confirmation Dialog */}
      <AlertDialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {is2FAEnabled
                ? t('admin.profileSettings.disable2FATitle')
                : t('admin.profileSettings.enable2FATitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {is2FAEnabled
                ? t('admin.profileSettings.disable2FADescription')
                : t('admin.profileSettings.enable2FADescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>
              {t('admin.profileSettings.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm2FA} disabled={loading}>
              {loading
                ? t('admin.profileSettings.processing')
                : is2FAEnabled
                  ? t('admin.profileSettings.disable')
                  : t('admin.profileSettings.enable')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.profileSettings.scanQRCode')}</DialogTitle>
            <DialogDescription>
              {t('admin.profileSettings.scanQRDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG value={qrUri} size={200} />
            </div>
            <p className="text-sm text-gray-500 text-center">
              {t('admin.profileSettings.qrInstructions')}
            </p>
            {/* TOTP Input Section */}
            <div className="w-full space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="totp">{t('admin.profileSettings.enterTOTP')}</Label>
                <Input
                  id="totp"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder={t('admin.profileSettings.totpPlaceholder')}
                  maxLength={6}
                />
              </div>
              <Button
                onClick={onConfirmSetup}
                disabled={loading || totpCode.length !== 6}
                className="w-full"
              >
                {loading
                  ? t('admin.profileSettings.verifying')
                  : t('admin.profileSettings.activate2FA')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
