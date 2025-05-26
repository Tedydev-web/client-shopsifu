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
import { ShieldCheck, Smartphone } from "lucide-react"
import Link from "next/link"

interface Profile2FAModalProps {
  show2FADialog: boolean
  setShow2FADialog: (open: boolean) => void
  showQRDialog: boolean
  setShowQRDialog: (open: boolean) => void
  is2FAEnabled: boolean
  loading?: boolean
  qrUri: string
  secret?: string
  recoveryCodes?: string[]
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
  secret,
  recoveryCodes = [],
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
        <DialogContent className="max-w-lg bg-[#23272f] text-white rounded-xl p-0 overflow-hidden">
          <div className="px-8 pt-8 pb-2">
            <DialogTitle className="text-2xl font-bold mb-1">Bật Ứng Dụng Xác Thực</DialogTitle>
            <DialogDescription className="text-gray-300 mb-4">
              Tăng độ bảo mật cho tài khoản trong 3 bước đơn giản:
            </DialogDescription>
          </div>
          <div className="px-8 pb-2">
            {/* Bước 1: Tải app */}
            <div className="flex items-center gap-4 mb-6">
              <Smartphone className="w-10 h-10 text-gray-400" />
              <div>
                <div className="font-semibold text-white">Tải Ứng Dụng Xác Thực</div>
                <div className="text-gray-300 text-sm">
                  Tải và cài đặt <Link href="https://authy.com/" target="_blank" className="underline text-blue-400">Authy</Link> hoặc <Link href="https://support.google.com/accounts/answer/1066447?hl=vi" target="_blank" className="underline text-blue-400">Trình Xác Thực Google</Link> cho điện thoại hoặc máy tính bảng.
                </div>
              </div>
            </div>
            {/* Bước 2: QR */}
            <div className="mb-6">
              <div className="font-semibold mb-2">Quét Mã QR</div>
              <div className="flex flex-col items-center">
                <QRCodeSVG value={qrUri} size={160} />
              </div>
              <div className="text-gray-300 text-sm mt-2">
                Mở ứng dụng xác thực và quét hình ảnh từ phải sang trái bằng máy ảnh trên điện thoại.
              </div>
            </div>
            {/* Bước 3: Secret code */}
            <div className="mb-6">
              <div className="font-semibold mb-2">Mã Số 2FA (Nhập Thủ Công)</div>
              <div className="bg-[#181a20] rounded-md px-4 py-3 font-mono text-lg tracking-widest text-blue-300 select-all break-all">
                {secret}
              </div>
            </div>
            {/* Recovery codes */}
            {recoveryCodes.length > 0 && (
              <div className="mb-6">
                <div className="font-semibold mb-2">Mã Khôi Phục (Recovery Codes)</div>
                <div className="grid grid-cols-2 gap-2">
                  {recoveryCodes.map((code, idx) => (
                    <div key={idx} className="bg-[#181a20] rounded px-3 py-2 font-mono text-base text-yellow-300 select-all">
                      {code}
                    </div>
                  ))}
                </div>
                <div className="text-gray-400 text-xs mt-1">Lưu lại các mã này để khôi phục tài khoản nếu mất quyền truy cập 2FA.</div>
              </div>
            )}
            {/* Nhập mã xác minh */}
            <div className="mb-2">
              <div className="font-semibold mb-2">Đăng Nhập Bằng Mã Của Bạn</div>
              <div className="text-gray-300 text-sm mb-2">Nhập mã xác minh gồm 6 chữ số đã được tạo.</div>
              <div className="flex gap-2">
                <Input
                  className="bg-[#181a20] border border-gray-600 text-white font-mono text-lg w-40"
                  maxLength={6}
                  value={totpCode}
                  onChange={e => setTotpCode(e.target.value)}
                  placeholder="000 000"
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  disabled={loading || totpCode.length !== 6}
                  onClick={onConfirmSetup}
                >
                  {loading ? "Đang xác minh..." : "Kích hoạt"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
