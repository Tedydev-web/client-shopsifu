import UserTable from "@/components/admin/users/users-table";

export default function UsersPage() {
    return(
        <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản Lý Người Dùng</h2>
          <p className="text-muted-foreground">
            Quản lý tất cả người dùng của bạn tại đây
          </p>
        </div>

      </div>
      <UserTable />
    </div>
    )
}
