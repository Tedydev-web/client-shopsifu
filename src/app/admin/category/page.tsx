'use client';

import CategoryTableWrapper from '@/components/admin/category/category-Wrapper';
import { useTranslations } from 'next-intl';

export default function CategoryPage() {
  const t  = useTranslations("admin.ModuleCategory");
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t('title')}
        </h2>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>
      <CategoryTableWrapper />
    </div>
  );
}

