"use client"

import { MoreHorizontal, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { SettingTable, SettingTableColumn } from '@/components/ui/settings-component/settings-table'
import { profileMockData } from './profile-MockData'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { ProfileUpdateSheet } from './profile-Update'
import { Profile2FAModal } from './profile-2faModal'
import { useProfile } from './useProfile'

export function ProfileSettingsTable() {
  // Dữ liệu mẫu, có thể lấy từ props hoặc context
  const profile = profileMockData
  // State for update sheet
  const [openUpdate, setOpenUpdate] = useState(false)

  // 2FA logic from useProfile
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
    handle2FAToggle,
    handleConfirm2FA,
    handleConfirmSetup,
    t,
  } = useProfile()

  const columns: SettingTableColumn[] = [
    { label: t('admin.profileSettings.name'), value: profile.name },
    { label: 'Email', value: profile.email },
    { label: t('admin.profileSettings.lang'), value: profile.language },
  ]

  return (
    <>
      <SettingTable
        columns={columns}
        title={t('admin.profileSettings.accountInfo')}
        subtitle={t('admin.profileSettings.manageAccount')}
        rightAction={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="p-2 rounded-full hover:bg-gray-100 bg-white" title="More actions">
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="p-0 px-2">
              <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
                <Pencil className="w-4 h-4" />
                {t('admin.profileSettings.edit')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-[580px_1fr] px-6 py-4 gap-y-1 gap-x-6 items-start">
          <div className="w-40 text-gray-600 text-sm">{t('admin.profileSettings.2faVerify')}</div>
          <div className="flex-1 flex">
            <Switch
              checked={is2FAEnabled}
              onCheckedChange={handle2FAToggle}
              id="2fa"
              disabled={loading}
            />
          </div>
        </div>
      </SettingTable>
      <ProfileUpdateSheet
        open={openUpdate}
        onOpenChange={setOpenUpdate}
        initialData={profile}
      />
      <Profile2FAModal
        show2FADialog={show2FADialog}
        setShow2FADialog={setShow2FADialog}
        showQRDialog={showQRDialog}
        setShowQRDialog={setShowQRDialog}
        is2FAEnabled={is2FAEnabled}
        loading={loading}
        qrUri={qrUri}
        totpCode={totpCode}
        setTotpCode={setTotpCode}
        onConfirm2FA={handleConfirm2FA}
        onConfirmSetup={handleConfirmSetup}
        t={t}
      />
    </>
  )
}