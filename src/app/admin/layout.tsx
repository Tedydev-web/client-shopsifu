import { Sidebar } from '@/components/admin/Sidebar'
import { Header } from '@/components/admin/Header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Header ở trên cùng, full width */}
      <Header />
      
      <div className="flex pt-16"> {/* Thêm padding-top bằng chiều cao header (16) */}
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <main className="flex-1 ml-64 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
