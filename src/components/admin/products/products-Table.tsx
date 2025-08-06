'use client';

import { useProducts, ProductColumn } from './useProducts';
import { productsColumns } from './products-Columns';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductUrl } from '@/utils/slugify';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table-component/data-table';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';
import SearchInput from '@/components/ui/data-table-component/search-input';
import DataTableViewOption from '@/components/ui/data-table-component/data-table-view-option';
import { ProductsFilter } from './products-Filter';
import { ProductsExportData } from './products-ExportData';
import type { Table as TanstackTable } from '@tanstack/react-table';
import { useDataTable } from '@/hooks/useDataTable';

export function ProductsTable() {
  const t = useTranslations('admin.ModuleProduct');
  const router = useRouter();
  const {
    data,
    loading,
    pagination,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    deleteOpen,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    handlePriceFilterChange,
    priceFilter,
    handleCategoryFilterChange,
    categoryFilter,
    searchQuery,
  } = useProducts();

  const onEdit = (product: ProductColumn) => {
    router.push(`/admin/products/${product.id}`);
  };

  const onView = (product: ProductColumn) => {
    // Use window.open to open the client product page in a new tab
    const productUrl = getProductUrl(product.name, product.id);
    window.open(productUrl, '_blank');
  };

  const columns = productsColumns({ onEdit, onDelete: handleOpenDelete, onView });
  const table = useDataTable({ data, columns });

  // Toolbar component to pass into DataTable
  const ProductsTableToolbar = ({ table }: { table: TanstackTable<ProductColumn> }) => (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <SearchInput
          value={searchQuery || ''}
          onValueChange={handleSearch}
          placeholder={t('searchPlaceholder')}
          className="w-full md:max-w-sm"
        />
        <ProductsFilter 
          table={table} 
          onPriceFilterChange={handlePriceFilterChange}
          currentPriceFilter={priceFilter}
          onCategoryFilterChange={handleCategoryFilterChange}
          currentCategoryFilter={categoryFilter}
        />
      </div>
      <div className="flex items-center gap-2">
        <ProductsExportData data={data} table={table} />
        <DataTableViewOption table={table} />
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Link href="/admin/products/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('AddNew.page.breadcrumb.newPage')}
          </Button>
        </Link>
      </div>
        <DataTable
          table={table}
          columns={columns}
          loading={loading}
          notFoundMessage={t('DataTable.notFound')}
          Toolbar={ProductsTableToolbar}
          pagination={{
            metadata: pagination,
            onPageChange: handlePageChange,
            onLimitChange: handleLimitChange,
          }}
        />

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title={t('DeleteModal.title')}
        description={t('DeleteModal.description')}
      />
    </div>
  );
}
