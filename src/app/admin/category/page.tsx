'use client';

import CategoryTableWrapper from '@/components/admin/category/category-Wrapper';
import { useTranslation } from 'react-i18next';

export default function CategoryPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t('admin.pages.category.title')}
        </h2>
        <p className="text-muted-foreground">
          {t('admin.pages.category.subtitle')}
        </p>
      </div>
      <CategoryTableWrapper />
    </div>
  );
}

