'use client'
import VoucherTable from "@/components/admin/voucher/voucher-Table";
import { useTranslations } from "next-intl";

export default function VoucherPage() {
  const t = useTranslations()

  return(
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.ModuleVouchers.title")}</h2>
        <p className="text-muted-foreground">
          {t("admin.ModuleVouchers.subtitle")}
        </p>
      </div>
      <VoucherTable />  
    </div>
  )
}
