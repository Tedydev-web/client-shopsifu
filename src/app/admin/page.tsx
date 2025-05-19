import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'
import { Card } from '@/components/ui/card'
import { 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign,
  TrendingUp,
  Activity
} from 'lucide-react'

const stats = [
  {
    title: 'Tổng doanh thu',
    value: '12,345,000đ',
    icon: <DollarSign className="w-6 h-6" />,
    change: '+12.5%',
    changeType: 'positive'
  },
  {
    title: 'Đơn hàng mới',
    value: '45',
    icon: <ShoppingCart className="w-6 h-6" />,
    change: '+8.2%',
    changeType: 'positive'
  },
  {
    title: 'Sản phẩm bán chạy',
    value: '12',
    icon: <Package className="w-6 h-6" />,
    change: '+3.1%',
    changeType: 'positive'
  },
  {
    title: 'Khách hàng mới',
    value: '23',
    icon: <Users className="w-6 h-6" />,
    change: '-2.4%',
    changeType: 'negative'
  }
]

export const metadata: Metadata = metadataConfig['/admin']
export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tổng quan</h1>
        <p className="text-muted-foreground">
          Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                  <TrendingUp className={`w-4 h-4 ml-1 ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`} />
                </div>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Hoạt động gần đây</h2>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {/* Thêm danh sách hoạt động ở đây */}
            <p className="text-sm text-muted-foreground">
              Chưa có hoạt động nào gần đây
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Thống kê bán hàng</h2>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {/* Thêm biểu đồ thống kê ở đây */}
            <p className="text-sm text-muted-foreground">
              Chưa có dữ liệu thống kê
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
