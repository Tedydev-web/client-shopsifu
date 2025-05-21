// import { AuditLogsTable } from "@/components/admin/audit-logs/auditLogs-Table";
import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'
import { useTranslation } from 'react-i18next'

export const metadata: Metadata = metadataConfig['/admin/audit-logs']
export default function AuditLogsPage() {
  const { t } = useTranslation("admin")
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('auditLogs.title')}</h2>
        <p className="text-muted-foreground">
          {t('auditLogs.subtitle')}
        </p>
      </div>
      {/* <AuditLogsTable /> */}
    </div>
  )
}