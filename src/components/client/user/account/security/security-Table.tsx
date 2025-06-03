'use client'

import { useState } from 'react'
import { PasswordSecuritySession } from './security-Session'
import { Clock, ChevronRight } from 'lucide-react'

export function PasswordSecurityTable() {
  const [currentView, setCurrentView] = useState<'table' | 'sessions'>('table')

  if (currentView === 'sessions') {
    return <PasswordSecuritySession onBack={() => setCurrentView('table')} />
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">Bảo mật thiết bị</h2>
        <p className="text-sm text-gray-500">Xem và quản lý các thiết bị đang đăng nhập vào tài khoản của bạn.</p>
      </div> */}

      <div
        onClick={() => setCurrentView('sessions')}
        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-600" />
          <div>
            <div className="text-sm font-medium text-gray-900">Thiết bị đăng nhập</div>
            <div className="text-xs text-gray-500">2 thiết bị đang hoạt động</div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  )
}
