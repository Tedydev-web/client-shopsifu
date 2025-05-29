'use client'
import UserTable from "@/components/admin/users/users-Table";
import { useState } from "react";
import { SearchInput } from "@/components/ui/data-table-component/search-input";
import UsersModalUpsert from "@/components/admin/users/users-ModalUpsert";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const {t} = useTranslation('')

  return(
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('admin.users.title')}</h2>
        <p className="text-muted-foreground">
          {t('admin.users.subtitle')}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder={t('admin.users.searchPlaceholder')}
        />
        <Button onClick={() => setOpenModal(true)}>
          {t('admin.users.add')}
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
