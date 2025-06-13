"use client"

import { MoreHorizontal, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { SettingTable, SettingTableColumn } from '@/components/ui/settings-component/settings-table'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { ProfileUpdateSheet } from './profile-Update'
import { useUserData } from '@/hooks/useGetData-UserLogin'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function ProfileSettingsTable() {
  const user = useUserData();

  const [openUpdate, setOpenUpdate] = useState(false);

  if (!user) {
    return <div>Loading user data...</div>; // Or a skeleton loader
  }
  const columns: SettingTableColumn[] = [
    {
      label: 'Avatar',
      value: (
        <Avatar>
          <AvatarImage src={user.avatar || ''} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      )
    },
    { label: 'Tên người dùng', value: user.username },
    { label: 'Họ và tên', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Số điện thoại', value: user.phoneNumber },
    {
      label: 'Trạng thái tài khoản',
      value: <Badge variant={user.status === 'ACTIVE' ? 'secondary' : 'destructive'}>{user.status}</Badge>
    },
    {
      label: 'Vai trò tài khoản',
      value: <Badge variant="outline">{user.role}</Badge>
    },
    {
      label: 'Ngày tạo tài khoản',
      value: new Date(user.createdAt).toLocaleDateString('vi-VN')
    }
  ];

  return (
    <>
      <SettingTable
        columns={columns}
        title={'Thông tin tài khoản'}
        subtitle={'Quản lý thông tin tài khoản của bạn'}
        rightAction={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2 rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <ProfileUpdateSheet
        open={openUpdate}
        onOpenChange={setOpenUpdate}
      />
    </>
  );
}