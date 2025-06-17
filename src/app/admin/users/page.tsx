'use client'
import UserTable from "@/components/admin/users/users-Table";
import { useTranslation } from "react-i18next";

export default function UsersPage() {
  const {t} = useTranslation('')

  return(
   <div className="space-y-6">
         <div>
           <h2 className="text-2xl font-bold tracking-tight">{t("admin.users.title")}</h2>
           <p className="text-muted-foreground">
             {t("admin.users.subtitle")}
           </p>
         </div>
         <UserTable />
       </div>
  )
}
