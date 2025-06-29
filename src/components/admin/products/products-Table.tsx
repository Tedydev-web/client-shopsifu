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

export function ProductsTable() {
  const t = useTranslations()
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
    columns: productsColumns({ onDelete: handleOpenDelete, onEdit: handleOpenModal }),
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-end gap-2">
        <SearchInput
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t("admin.products.searchPlaceholder")}
          className="w-full md:max-w-sm"
        />
        <DataTableViewOption table={table} />
      </div>

      <div className="relative">
        <DataTable
          table={table}
          columns={productsColumns({ onDelete: handleOpenDelete, onEdit: handleOpenModal })}
          loading={loading || isSearching}
          notFoundMessage={t('admin.products.notFound')}
        />
      </div>

      {/* <ProductsModalUpsert
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        product={selectedProduct}
      /> */}

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title={t("admin.products.deleteTitle")}
        description={t("admin.products.deleteDescription")}
      />
    </div>
  )
}
