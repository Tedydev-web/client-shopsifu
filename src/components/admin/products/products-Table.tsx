'use client'

import { useEffect, useState } from "react"
import { productsColumns, Product } from "./products-Columns"
import SearchInput from "@/components/ui/data-table-component/search-input"
// import ProductsModalUpsert from "./products-ModalUpsert" // Will be created later
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal"
import { DataTable } from "@/components/ui/data-table-component/data-table"
import { useProducts } from "./useProducts"
import { useTranslations } from "next-intl"
import DataTableViewOption from "@/components/ui/data-table-component/data-table-view-option"
import { useDataTable } from "@/hooks/useDataTable"
import { ProductsExportData } from "./products-ExportData" // Import component export
import type { Table as TanstackTable } from '@tanstack/react-table' // Import type
import { ProductsFilter } from "./products-Filter"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProductsTable() {
  const t = useTranslations('admin.ModuleProduct')
  const {
    products,
    loading,
    isSearching,
    search,
    handleSearch,
    isModalOpen,
    selectedProduct,
    getAllProducts,
    deleteProduct,
    createProduct,
    updateProduct,
    handleOpenModal,
    handleCloseModal
  } = useProducts()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    getAllProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpenDelete = (product: Product) => {
    setProductToDelete(product)
    setDeleteOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false)
    setProductToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    setDeleteLoading(true)
    try {
      const success = await deleteProduct(productToDelete.id)
      if (success) {
        handleCloseDeleteModal()
        getAllProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, formData)
      } else {
        await createProduct(formData)
      }
      handleCloseModal()
      getAllProducts()
    } catch (error) {
      console.error('Error handling product:', error)
    }
  }

  const table = useDataTable({
    data: products,
    columns: productsColumns({ onDelete: handleOpenDelete, onEdit: handleOpenModal, onView: handleOpenModal }),
  })

  // Định nghĩa Toolbar component để truyền vào DataTable
  const ProductsTableToolbar = ({ table }: { table: TanstackTable<Product> }) => (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <SearchInput
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full md:max-w-sm"
        />
        <ProductsFilter table={table} /> 
      </div>
      <div className="flex items-center gap-2">
        <ProductsExportData data={products} table={table} />
        <DataTableViewOption table={table} />
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end mb-4">
        <Link href="/admin/products/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("AddNew.page.breadcrumb.newPage")}
          </Button>
        </Link>
      </div>
      <DataTable
        table={table}
        columns={productsColumns({ onDelete: handleOpenDelete, onEdit: handleOpenModal, onView: handleOpenModal })}
        loading={loading || isSearching}
        notFoundMessage={t('DataTable.notFound')}
        Toolbar={ProductsTableToolbar} // Truyền component Toolbar vào đây
      />
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title={t("DeleteModal.title")}
        description={t("DeleteModal.description")}
      />
    </div>
  )
}
