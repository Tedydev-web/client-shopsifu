'use client'

import { useEffect, useState } from "react"
import { LanguagesColumns, Language } from "./languages-Columns"
import SearchInput from "@/components/ui/data-table/search-input"
import LanguagesModalUpsert from "./languages-ModalUpsert"
import { PlusIcon } from "lucide-react"
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal"
import { DataTable } from "@/components/ui/data-table/data-table"
import { Pagination } from "@/components/ui/data-table/pagination"
import { Button } from "@/components/ui/button"
import { useLanguages } from "./useLanguages"

export function LanguagesTable() {
  const {
    languages,
    totalItems,
    loading,
    isModalOpen,
    selectedLanguage,
    getAllLanguages,
    deleteLanguage,
    createLanguage,
    updateLanguage,
    handleOpenModal,
    handleCloseModal
  } = useLanguages()

  const [searchValue, setSearchValue] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [languageToDelete, setLanguageToDelete] = useState<Language | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Pagination states
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(totalItems / limit)

  useEffect(() => {
    getAllLanguages()
  }, [])

  const handleEdit = (language: Language) => {
    handleOpenModal(language)
  }

  const handleOpenDelete = (language: Language) => {
    setLanguageToDelete(language)
    setDeleteOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false)
    setLanguageToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!languageToDelete) return
    setDeleteLoading(true)
    try {
      const success = await deleteLanguage(languageToDelete.code)
      if (success) {
        handleCloseDeleteModal()
        getAllLanguages() // Refresh data
      }
    } catch (error) {
      console.error('Error deleting language:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSubmit = async (values: { code: string; name: string; isActive: boolean }) => {
    try {
      if (selectedLanguage) {
        // Update
        const response = await updateLanguage(selectedLanguage.code, { name: values.name })
        if (response) {
          handleCloseModal()
          getAllLanguages() // Refresh data
        }
      } else {
        // Create
        const response = await createLanguage({ id: values.code, name: values.name })
        if (response) {
          handleCloseModal()
          getAllLanguages() // Refresh data
        }
      }
    } catch (error) {
      console.error('Error saving language:', error)
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setOffset((page - 1) * limit)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setOffset(0)
    setCurrentPage(1)
  }

  // Filter data based on search
  const filteredData = searchValue
    ? languages.filter(lang =>
        lang.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchValue.toLowerCase())
      )
    : languages

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <SearchInput
          value={searchValue}
          onValueChange={handleSearch}
          placeholder="Tìm kiếm ngôn ngữ..."
          className="max-w-sm"
        />
        <Button 
          onClick={() => handleOpenModal()}
          className="ml-auto"
        >
          <PlusIcon className="w-4 h-4 mr-2" />Thêm mới ngôn ngữ
        </Button>
      </div>

      <DataTable
        columns={LanguagesColumns({ onDelete: handleOpenDelete, onEdit: handleEdit })}
        data={filteredData}
      />

      {totalPages > 0 && (
        <Pagination
          limit={limit}
          offset={offset}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalItems}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}

      <LanguagesModalUpsert 
        open={isModalOpen}
        onClose={handleCloseModal}
        mode={selectedLanguage ? "edit" : "add"}
        language={selectedLanguage}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => { if (!deleteLoading) handleCloseDeleteModal() }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa ngôn ngữ"
        description={
          languageToDelete
            ? <>Bạn có chắc chắn muốn xóa ngôn ngữ <b>{languageToDelete.name}</b> không? Hành động này không thể hoàn tác.</>
            : ""
        }
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleteLoading}
      />
    </div>
  )
}
