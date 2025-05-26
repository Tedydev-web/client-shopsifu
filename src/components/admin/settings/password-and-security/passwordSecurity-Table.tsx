import { SettingTable } from '@/components/ui/settings-component/settings-table'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

export function PasswordSecurityTable() {
  return (
    <SettingTable
      title="Bảo mật & Mật khẩu"
      subtitle="Quản lý bảo mật tài khoản và các thiết lập liên quan đến mật khẩu."
    >
      <div className="divide-y divide-gray-200">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between px-6 py-6 rounded-none text-left hover:bg-gray-50 first:hover:rounded-t-xl last:hover:rounded-b-xl transition-all"
        >
          <span className="text-gray-700 text-sm font-medium">Đổi mật khẩu</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Button>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between px-6 py-6 rounded-none text-left hover:bg-gray-50 first:hover:rounded-t-xl last:hover:rounded-b-xl transition-all"
        >
          <span className="text-gray-700 text-sm font-medium">Nơi bạn đăng nhập</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Button>
      </div>
    </SettingTable>
  )
}
