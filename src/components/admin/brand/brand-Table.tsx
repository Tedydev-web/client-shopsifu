'use client'

import { useEffect, useState } from "react"
import { BrandColumns, Brand } from "./brand-Columns"
import SearchInput from "@/components/ui/data-table-component/search-input"
import BrandModalUpsert from "./brand-ModalUpsert"
import { PlusIcon } from "lucide-react"
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal"
import { DataTable } from "@/components/ui/data-table-component/data-table"
import { Pagination } from "@/components/ui/data-table-component/pagination"
import { Button } from "@/components/ui/button"
import { useBrand } from "./useBrand"
import { useDebounce } from "@/hooks/useDebounce"
import { Loader2 } from "lucide-react"

export function BrandTable() {
  const {
    brands,
    totalItems,
    page,
    totalPages,
    loading,
    isModalOpen,
    selectedBrand,
    getAllBrands,
    deleteBrand,
    createBrand,
    updateBrand,
    handleOpenModal,
    handleCloseModal,
    handleSearch: searchBrands
  } = useBrand()

  const [searchValue, setSearchValue] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Pagination states
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)

  // Debounce search value
  const debouncedSearchValue = useDebounce(searchValue, 1000)

  useEffect(() => {
    getAllBrands({ metadata: { page: 1, limit: 10 } })
  }, [])

  // Effect to handle debounced search
  useEffect(() => {
    if (debouncedSearchValue !== undefined) {
      setIsSearching(true)
      searchBrands(debouncedSearchValue)
      getAllBrands({ metadata: { page: 1, limit: limit } })
        .finally(() => {
          setIsSearching(false)
        })
    }
  }, [debouncedSearchValue, limit])

  const handleEdit = (brand: Brand) => {
    handleOpenModal(brand)
  }

  const handleOpenDelete = (brand: Brand) => {
    setBrandToDelete(brand)
    setDeleteOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false)
    setBrandToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!brandToDelete) return
    setDeleteLoading(true)
    try {
      const success = await deleteBrand(brandToDelete.code)
      if (success) {
        handleCloseDeleteModal()
        getAllBrands({ metadata: { page: page, limit: limit } })
      }
    } catch (error) {
      console.error('Error deleting brand:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSubmit = async (values: { 
    code: string; 
    name: string; 
    description?: string;
    logo?: string;
    website?: string;
    country?: string;
    status?: "active" | "inactive";
  }) => {
    try {
      if (selectedBrand) {
        // Update
        const response = await updateBrand(selectedBrand.code, {
          name: values.name,
          description: values.description,
          logo: values.logo,
          website: values.website,
          country: values.country,
          status: values.status
        })
        if (response) {
          handleCloseModal()
          getAllBrands({ metadata: { page: page, limit: limit } })
        }
      } else {
        // Create
        const response = await createBrand({
          code: values.code,
          name: values.name,
          description: values.description,
          logo: values.logo,
          website: values.website,
          country: values.country,
          status: values.status
        })
        if (response) {
          handleCloseModal()
          getAllBrands({ metadata: { page: page, limit: limit } })
        }
      }
    } catch (error) {
      console.error('Error saving brand:', error)
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handlePageChange = (newPage: number) => {
    getAllBrands({ metadata: { page: newPage, limit: limit } })
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    getAllBrands({ metadata: { page: 1, limit: newLimit } })
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <SearchInput
          value={searchValue}
          onValueChange={handleSearch}
          placeholder="Tìm kiếm thương hiệu..."
          className="max-w-sm"
        />
        <Button 
          onClick={() => handleOpenModal()}
          className="ml-auto"
        >
          <PlusIcon className="w-4 h-4 mr-2" />Thêm Thương Hiệu
        </Button>
      </div>

      <div className="relative">
        {(loading || isSearching) && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <DataTable
          columns={BrandColumns({ onDelete: handleOpenDelete, onEdit: handleEdit })}
          data={brands}
        />
      </div>

      {totalPages > 0 && (
        <Pagination
          limit={limit}
          page={page}
          totalPages={totalPages}
          totalRecords={totalItems}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}

      <BrandModalUpsert
        open={isModalOpen}
        onClose={handleCloseModal}
        mode={selectedBrand ? "edit" : "add"}
        brand={selectedBrand || undefined}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => { if (!deleteLoading) handleCloseDeleteModal() }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa thương hiệu"
        description={
          brandToDelete
            ? <>Bạn có chắc chắn muốn xóa thương hiệu <b>{brandToDelete.name}</b> không? Hành động này không thể hoàn tác.</>
            : ""
        }
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleteLoading}
      />
    </div>
  )
}
