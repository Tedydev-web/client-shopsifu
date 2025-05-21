'use client'

import { useEffect, useState } from "react"
import { AuditLogsColumns, AuditLog } from "./auditLogs-Columns"
import SearchInput from "@/components/ui/data-table/search-input"
import AuditLogsModalUpsert from "./auditLogs-ModalUpsert"
import { PlusIcon } from "lucide-react"
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal"
import { DataTable } from "@/components/ui/data-table/data-table"
import { Pagination } from "@/components/ui/data-table/pagination"
import { Button } from "@/components/ui/button"
import { useAuditLogs } from "./useAuditLogs"
import { useDebounce } from "@/hooks/useDebounce"
import { Loader2 } from "lucide-react"

export function AuditLogsTable() {
  const {
    auditLogs,
    totalItems,
    currentPage,
    totalPages,
    loading,
    isModalOpen,
    selectedAuditLog,
    getAllAuditLogs,
    deleteAuditLog,
    createAuditLog,
    updateAuditLog,
    handleOpenModal,
    handleCloseModal
  } = useAuditLogs()

  const [searchValue, setSearchValue] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [auditLogToDelete, setAuditLogToDelete] = useState<AuditLog | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Pagination states
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)

  // Debounce search value
  const debouncedSearchValue = useDebounce(searchValue, 1000)

  useEffect(() => {
    getAllAuditLogs()
  }, [])

  // Effect to handle debounced search
  useEffect(() => {
    if (debouncedSearchValue !== undefined) {
      setIsSearching(true)
      getAllAuditLogs({ page: 1, limit, search: debouncedSearchValue })
        .finally(() => {
          setIsSearching(false)
        })
    }
  }, [debouncedSearchValue, limit])

  const handleEdit = (auditLog: AuditLog) => {
    handleOpenModal(auditLog)
  }

  const handleOpenDelete = (auditLog: AuditLog) => {
    setAuditLogToDelete(auditLog)
    setDeleteOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false)
    setAuditLogToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!auditLogToDelete) return
    setDeleteLoading(true)
    try {
      const success = await deleteAuditLog(auditLogToDelete.id)
      if (success) {
        handleCloseDeleteModal()
        getAllAuditLogs({ page: currentPage, limit })
      }
    } catch (error) {
      console.error('Error deleting audit log:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSubmit = async (values: { code: string; name: string }) => {
    try {
      if (selectedAuditLog) {
        // Update
        const response = await updateAuditLog(selectedAuditLog.id, { name: values.name })
        if (response) {
          handleCloseModal()
          getAllAuditLogs({ page: currentPage, limit })
        }
      } else {
        // Create
        const response = await createAuditLog({ id: values.code, name: values.name })
        if (response) {
          handleCloseModal()
          getAllAuditLogs({ page: currentPage, limit })
        }
      }
    } catch (error) {
      console.error('Error saving audit log:', error)
    }
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handlePageChange = (newOffset: number, newPage: number) => {
    getAllAuditLogs({ page: newPage, limit })
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    getAllAuditLogs({ page: 1, limit: newLimit })
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <SearchInput
          value={searchValue}
          onValueChange={handleSearch}
          placeholder="Tìm kiếm log..."
          className="max-w-sm"
        />
        <Button 
          onClick={() => handleOpenModal()}
          className="ml-auto"
        >
          <PlusIcon className="w-4 h-4 mr-2" />Thêm mới log
        </Button>
      </div>

      <div className="relative">
        {(loading || isSearching) && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <DataTable
          columns={AuditLogsColumns({ onDelete: handleOpenDelete, onEdit: handleEdit })}
          data={auditLogs}
        />
      </div>

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

      <AuditLogsModalUpsert 
        open={isModalOpen}
        onClose={handleCloseModal}
        mode={selectedAuditLog ? "edit" : "add"}
        auditLog={selectedAuditLog}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => { if (!deleteLoading) handleCloseDeleteModal() }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa ngôn ngữ"
        description={
          auditLogToDelete
            ? <>Bạn có chắc chắn muốn xóa log <b>{auditLogToDelete.id}</b> không? Hành động này không thể hoàn tác.</>
            : ""
        }
        confirmText="Xóa"
        cancelText="Hủy"
        loading={deleteLoading}
      />
    </div>
  )
}
