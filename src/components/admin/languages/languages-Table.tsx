'use client'

import { useEffect, useState } from "react"
import { LanguagesColumns, Language } from "./languages-Columns"
import SearchInput from "@/components/ui/data-table-component/search-input"
import LanguagesModalUpsert from "./languages-ModalUpsert"
import { PlusIcon } from "lucide-react"
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal"
import { DataTable } from "@/components/ui/data-table-component/data-table"
import { Pagination } from "@/components/ui/data-table-component/pagination"
import { Button } from "@/components/ui/button"
import { useLanguages } from "./useLanguages"
import { useDebounce } from "@/hooks/useDebounce"
import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
export function LanguagesTable() {
  const { t } = useTranslation()
  const {
    languages,
    totalItems,
    page,
    totalPages,
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
  const [isSearching, setIsSearching] = useState(false)

  // Pagination states
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)

  // Debounce search value
  const debouncedSearchValue = useDebounce(searchValue, 1000)

  useEffect(() => {
    getAllLanguages()
  }, [])

  // Effect to handle debounced search
  useEffect(() => {
    if (debouncedSearchValue !== undefined) {
      setIsSearching(true)
      getAllLanguages({ page: 1, limit, search: debouncedSearchValue })
        .finally(() => {
          setIsSearching(false)
        })
    }
  }, [debouncedSearchValue, limit])

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
        getAllLanguages({ page: page, limit })
      }
    } catch (error) {
      console.error('Error deleting language:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSubmit = async (values: { code: string; name: string }) => {
    try {
      if (selectedLanguage) {
        // Update
        const response = await updateLanguage(selectedLanguage.code, { name: values.name })
        if (response) {
          handleCloseModal()
          getAllLanguages({ page: page, limit })
        }
      } else {
        // Create
        const response = await createLanguage({ id: values.code, name: values.name })
        if (response) {
          handleCloseModal()
          getAllLanguages({ page: page, limit })
        }
      }
    } catch (error) {
      console.error('Error saving language:', error)
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handlePageChange = (newPage: number) => {
    getAllLanguages({ page: newPage, limit })
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    getAllLanguages({ page: 1, limit: newLimit })
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <SearchInput
          value={searchValue}
          onValueChange={handleSearch}
          placeholder={t("admin.languages.searchPlaceholder")}
          className="max-w-sm"
        />
        <Button 
          onClick={() => handleOpenModal()}
          className="ml-auto"
        >
          <PlusIcon className="w-4 h-4 mr-2" />{t("admin.languages.addAction")}
        </Button>
      </div>

      <div className="relative">
        {(loading || isSearching) && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <DataTable
          columns={LanguagesColumns({ onDelete: handleOpenDelete, onEdit: handleEdit })}
          data={languages}
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
