"use client";
import { AuditLogsTable } from "@/components/admin/audit-logs/auditLogs-Table";
import { useTranslation } from 'react-i18next';

export default function AuditLogsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('admin.auditLogs.title')}</h2>
        <p className="text-muted-foreground">
          {t('admin.auditLogs.subtitle')}
        </p>
      </div>
      <AuditLogsTable />
    </div>
  );
}