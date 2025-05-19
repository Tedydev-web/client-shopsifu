'use client'
import { LanguagesTable } from "@/components/admin/languages/languages-Table";

export default function LanguagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Quản lý ngôn ngữ</h2>
        <p className="text-muted-foreground">
          Quản lý tất cả ngôn ngữ của bạn tại đây
        </p>
      </div>
      <LanguagesTable />
    </div>
  )
}