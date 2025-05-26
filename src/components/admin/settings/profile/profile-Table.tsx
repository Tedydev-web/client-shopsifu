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

export function ProfileSettingsTable() {
  // Dữ liệu mẫu, có thể lấy từ props hoặc context
  const profile = profileMockData
  // State mẫu cho 2FA
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  // State for update sheet
  const [openUpdate, setOpenUpdate] = useState(false)

  const columns: SettingTableColumn[] = [
    { label: 'Tên', value: profile.name },
    { label: 'Email', value: profile.email },
    { label: 'Ngôn ngữ', value: profile.language },
  ]

  return (
    <>
      <SettingTable
        columns={columns}
        title="Thông tin tài khoản"
        subtitle="Quản lý thông tin tài khoản của bạn"
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
                Chỉnh sửa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-[580px_1fr] px-6 py-4 gap-y-1 gap-x-6 items-start">
          <div className="w-40 text-gray-600 text-sm">Xác thực hai yếu tố</div>
          <div className="flex-1 flex">
            <Switch
              checked={is2FAEnabled}
              onCheckedChange={setIs2FAEnabled}
              id="2fa"
            />
          </div>
        </div>
      </SettingTable>
      <ProfileUpdateSheet
        open={openUpdate}
        onOpenChange={setOpenUpdate}
        initialData={profile}
      />
    </>
  )
}