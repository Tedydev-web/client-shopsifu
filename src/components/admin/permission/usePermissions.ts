import { useState } from "react"
import { permissionService } from "@/services/permissionService"
import { showToast } from "@/components/ui/toastify"
import { parseApiError } from "@/utils/error"
import {
  PerCreateRequest,
  PerUpdateRequest,
  PerGetAllResponse
} from "@/types/permission.interface"
import { PaginationRequest } from "@/types/base.interface"

export interface Permission {
  id: number
  code: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [page, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Get all permissions
  const getAllPermissions = async (params?: PaginationRequest) => {
    try {
      setLoading(true)
      const response: PerGetAllResponse = await permissionService.getAllPermissions()
      const mappedPermissions: Permission[] = response.data.map(per => ({
        id: parseInt(per.id),
        name: per.name,
        path: per.path,
        code: per.id, // Using id as code
        isActive: true, // or per.isActive if available
        createdAt: per.createdAt,
        updatedAt: per.updatedAt
      }))
      setPermissions(mappedPermissions)
      setTotalItems(response.totalItems)
      setCurrentPage(response.page)
      setTotalPages(response.totalPages)
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Error fetching permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get permission by ID
  const getPermissionById = async (id: string) => {
    try {
      setLoading(true)
      const response = await permissionService.getPermissionById(id)
      return response
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Error fetching permission:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Create permission
  const createPermission = async (data: PerCreateRequest) => {
    try {
      setLoading(true)
      const response = await permissionService.createPermission(data)
      showToast("Tạo quyền thành công", "success")
      return response
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Error creating permission:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Update permission
  const updatePermission = async (id: string, data: PerUpdateRequest) => {
    try {
      setLoading(true)
      const response = await permissionService.updatePermission(id, data)
      showToast("Cập nhật quyền thành công", "success")
      return response
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Error updating permission:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Delete permission
  const deletePermission = async (id: string) => {
    try {
      setLoading(true)
      const response = await permissionService.deletePermission(id)
      showToast("Xóa quyền thành công", "success")
      return response
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Error deleting permission:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (permission?: Permission) => {
    if (permission) {
      setSelectedPermission(permission)
    } else {
      setSelectedPermission(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPermission(null)
  }

  return {
    permissions,
    totalItems,
    page,
    totalPages,
    isModalOpen,
    selectedPermission,
    loading,
    // API handlers
    getAllPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission,
    // UI handlers
    handleOpenModal,
    handleCloseModal,
  }
}
