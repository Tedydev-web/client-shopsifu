import { SettingTable } from '@/components/ui/settings-component/settings-table'
import { Button } from '@/components/ui/button'
import { ChevronRight, Lock, Shield, Clock, KeyRound } from 'lucide-react'

export function PasswordSecurityTable() {
  const columns = [
    {
      label: "Mật khẩu",
      value: "Đã thay đổi cách đây 3 tháng",
      startIcon: <Lock className="w-5 h-5 text-gray-400" />,
      endIcon: <ChevronRight className="w-5 h-5 text-gray-400" />
    },
    {
      label: "Xác minh 2 bước",
      value: "Chưa bật",
      startIcon: <Shield className="w-5 h-5 text-gray-400" />,
      endIcon: <ChevronRight className="w-5 h-5 text-gray-400" />
    },
    {
      label: "Thiết bị đăng nhập",
      value: "2 thiết bị đang hoạt động",
      startIcon: <Clock className="w-5 h-5 text-gray-400" />,
      endIcon: <ChevronRight className="w-5 h-5 text-gray-400" />
    },
    {
      label: "Mã khôi phục",
      value: "Chưa tạo",
      startIcon: <KeyRound className="w-5 h-5 text-gray-400" />,
      endIcon: <ChevronRight className="w-5 h-5 text-gray-400" />
    }
  ]

  return (
    <SettingTable
      title="Bảo mật & Mật khẩu"
      subtitle="Quản lý bảo mật tài khoản và các thiết lập liên quan đến mật khẩu."
      columns={columns}
    />
  )
}
