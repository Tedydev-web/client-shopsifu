"use client"

import { MoreHorizontal } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'

export function ProfileSettingsTable() {
  // Dữ liệu mẫu, có thể lấy từ props hoặc context
  const profile = {
    name: 'Nguyen Phat',
    email: 'nguyendangphat1312@gmail.com',
    language: 'English',
  }
  // State mẫu cho 2FA
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)

  return (
    <Card className="w-full max-w-none rounded-xl shadow-sm border-none">
      <CardHeader className="flex flex-row items-center justify-end px-6 py-5">
        <Button className="p-2 rounded-full hover:bg-gray-100 bg-white" title="More actions">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          <div className="flex items-center px-6 py-4">
            <div className="w-40 text-gray-600 text-sm">Name</div>
            <div className="flex-1 text-gray-900">{profile.name}</div>
          </div>
          <div className="flex items-center px-6 py-4">
            <div className="w-40 text-gray-600 text-sm">Email</div>
            <div className="flex-1 text-gray-900">{profile.email}</div>
          </div>
          <div className="flex items-center px-6 py-4">
            <div className="w-40 text-gray-600 text-sm">Language</div>
            <div className="flex-1 text-gray-900">{profile.language}</div>
          </div>
          <div className="flex items-center px-6 py-4">
            <div className="w-40 text-gray-600 text-sm">Xác thực hai yếu tố</div>
            <div className="flex-1 flex">
              <Switch
                checked={is2FAEnabled}
                onCheckedChange={setIs2FAEnabled}
                id="2fa"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}