'use client'

import { SettingTable, SettingTableColumn } from '@/components/ui/settings-component/settings-table'
import { ChevronRight, Lock, Shield, Clock, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { ChangePasswordModal } from './passwordSecurity-ChangePassword'
import { Profile2FAModal } from './passwordSecurity-2faModal'
import { usePasswordSecurity } from './usePasswordSecurity'
import { PasswordSecuritySession } from './passwordSecurity-Session'

export function PasswordSecurityTable() {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentView, setCurrentView] = useState('table') // 'table' or 'sessions'

  const {
    is2FAEnabled,
    show2FADialog,
    setShow2FADialog,
    showQRDialog,
    setShowQRDialog,
    qrUri,
    loading,
    totpCode,
    setTotpCode,
    recoveryCodes,
    handle2FAToggle,
    handleConfirm2FA,
    handleConfirmSetup,
    t
  } = usePasswordSecurity()

  // Mock user data - replace with actual user data
  const userInfo = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com"
  }

  const columns: SettingTableColumn[] = [
    {
      label: "Mật khẩu",
      value: "Đã thay đổi cách đây 3 tháng",
      startIcon: <Lock />,
      endIcon: <ChevronRight />,
      onClick: () => setShowChangePassword(true)
    },
    {
      label: "Xác minh 2 bước",
      value: is2FAEnabled ? "Đã bật" : "Chưa bật",
      startIcon: <Shield />,
      endIcon: <ChevronRight />,
      onClick: handle2FAToggle
    },
    {
      label: "Thiết bị đăng nhập",
      value: "2 thiết bị đang hoạt động", // You might want to update this with actual count
      startIcon: <Clock />,
      endIcon: <ChevronRight />,
      onClick: () => setCurrentView('sessions')
    },
    {
      label: "Mã khôi phục",
      value: is2FAEnabled ? "Đã tạo" : "Chưa tạo",
      startIcon: <KeyRound />,
      endIcon: <ChevronRight />
    }
  ]

  // Render based on currentView state
  if (currentView === 'sessions') {
    return <PasswordSecuritySession onBack={() => setCurrentView('table')} />;
  }

  return (
    <>
      <SettingTable                                                                                               
        title="Bảo mật & Mật khẩu"
        subtitle="Quản lý bảo mật tài khoản và các thiết lập liên quan đến mật khẩu."
        columns={columns}
      />
      <ChangePasswordModal
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
        userInfo={userInfo}
      />
      <Profile2FAModal
        show2FADialog={show2FADialog}
        setShow2FADialog={setShow2FADialog}
        showQRDialog={showQRDialog}
        setShowQRDialog={setShowQRDialog}
        is2FAEnabled={is2FAEnabled}
        loading={loading}
        qrUri={qrUri}
        secret={qrUri.split('secret=')[1]?.split('&')[0] || ''}
        recoveryCodes={recoveryCodes}
        totpCode={totpCode}
        setTotpCode={setTotpCode}
        onConfirm2FA={handleConfirm2FA}
        onConfirmSetup={handleConfirmSetup}
        t={t}
      />
    </>
  )
}
