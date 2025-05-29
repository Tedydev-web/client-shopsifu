"use client"

import { MoreHorizontal, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useProfile } from './useProfile'

export function ProfileSettingsTable() {
  // Dữ liệu mẫu, có thể lấy từ props hoặc context
  const profile = profileMockData
  // State for update sheet
  const [openUpdate, setOpenUpdate] = useState(false)

  // Profile logic from useProfile
  const {
    loading,
    handleUpdateProfile,
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
      </SettingTable>
      <ProfileUpdateSheet
        open={openUpdate}
        onOpenChange={setOpenUpdate}
        initialData={profile}
      />
    </>
  )
}