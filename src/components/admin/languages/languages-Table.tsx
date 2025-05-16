'use client'

import { useState } from "react"
import { LanguagesColumns, Language } from "./languages-Columns"
import { languagesMockData } from "./languages-MockData"
import SearchInput from "@/components/ui/data-table/search-input"
import LanguagesModalUpsert from "./languages-ModalUpsert"
import { PlusIcon } from "lucide-react"
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal"
import { DataTable } from "@/components/ui/data-table/data-table"
import { Pagination } from "@/components/ui/data-table/pagination"
import { Button } from "@/components/ui/button"

export function LanguagesTable() {
  const [searchValue, setSearchValue] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [languageToDelete, setLanguageToDelete] = useState<Language | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Pagination states
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const totalRecords = languagesMockData.length
  const totalPages = Math.ceil(totalRecords / limit)

  const handleEdit = (language: Language) => {
    setSelectedLanguage(language)
    setOpenModal(true)
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
      // TODO: Implement delete logic
      console.log('Delete language:', languageToDelete)
      handleCloseDeleteModal()
    } catch (error) {
      console.error('Error deleting language:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSubmit = async (values: { code: string; name: string; isActive: boolean }) => {
    // TODO: Implement submit logic
    console.log(values)
    setOpenModal(false)
    setSelectedLanguage(null)
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
          onClick={() => {
            setSelectedLanguage(null)
            setOpenModal(true)
          }}
          className="ml-auto"
        >
          <PlusIcon className="w-4 h-4 mr-2" />Thêm mới ngôn ngữ
        </Button>
      </div>

      <DataTable
        columns={LanguagesColumns({ onDelete: handleOpenDelete, onEdit: handleEdit })}
        data={
          searchValue
            ? languagesMockData.filter(lang =>
                lang.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                lang.code.toLowerCase().includes(searchValue.toLowerCase())
              )
            : languagesMockData
        }
      />

      {totalPages > 0 && (
        <Pagination
          limit={limit}
          offset={offset}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}

      <LanguagesModalUpsert 
        open={openModal}
        onClose={() => {
          setOpenModal(false)
          setSelectedLanguage(null)
        }}
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
