'use client'
import UserTable from "@/components/admin/users/users-table1";
import { useState } from "react";
import { SearchInput } from "@/components/ui/data-table/search-input";
import UsersModalUpsert from "@/components/admin/users/users-ModalUpsert";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  return(
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Quản Lý Người Dùng</h2>
        <p className="text-muted-foreground">
          Quản lý tất cả người dùng của bạn tại đây
        </p>
      </div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Tìm kiếm theo tên, email..."
        />
        <Button onClick={() => setOpenModal(true)}>
          Thêm mới
        </Button>
      </div>
      <UserTable search={search} />
      <UsersModalUpsert 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        mode="add"
        onSubmit={async () => {}}
      />
    </div>
  )
}
