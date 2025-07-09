import { useState, useCallback, useEffect } from "react"
import { roleService } from "@/services/roleService"
import { permissionService } from "@/services/permissionService"
import { showToast } from "@/components/ui/toastify"
import { parseApiError } from "@/utils/error"
import {
  RoleGetAllResponse,
  RoleCreateRequest,
  RoleUpdateRequest,
} from "@/types/auth/role.interface"
import { PerGetAllResponse, PermissionDetail } from "@/types/auth/permission.interface"
import { Role } from "./roles-Columns"
import { useServerDataTable } from "@/hooks/useServerDataTable"
import { useTranslations } from "next-intl"

export function useRoles() {
  const t = useTranslations();
  
  // Modal states
  const [upsertOpen, setUpsertOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null)
  
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Permissions data for the modal
  const [permissionsData, setPermissionsData] = useState<Record<string, PermissionDetail[]>>({})
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true)
  
  // Callbacks for useServerDataTable
  const getResponseData = useCallback((response: any) => {
    return response.data || []
  }, [])

  const getResponseMetadata = useCallback((response: any) => {
    const metadata = response.metadata || {}
    return {
      totalItems: metadata.totalItems || 0,
      page: metadata.page || 1,
      totalPages: metadata.totalPages || 1,
      limit: metadata.limit || 10,
      hasNext: metadata.hasNext || false,
      hasPrevious: metadata.hasPrev || false
    }
  }, [])

  const mapResponseToData = useCallback((role: any): Role => {
    return {
      ...role,
      id: Number(role.id),
      description: role.description || "",
      isActive: role.isActive ?? true,
    }
  }, [])

  // Use the useServerDataTable hook
  const {
    data: roles,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
  } = useServerDataTable({
    fetchData: roleService.getAll,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: "createdAt", sortOrder: "asc" },
    defaultLimit: 10,
  })

  // Fetch permissions for the modal
  const fetchPermissions = useCallback(async () => {
    try {
      setIsPermissionsLoading(true)
      // Truyền limit=1000 để lấy tất cả permissions
      const response = await permissionService.getAll({ 
        page: 1, 
        limit: 1000, 
        sortBy: 'module', 
        sortOrder: 'asc' 
      })
      
      // Tạo cấu trúc dữ liệu phù hợp dựa trên module (vì API không còn gộp sẵn)
      const groupedPermissions = response.data.reduce((acc: Record<string, PermissionDetail[]>, item) => {
        // Lấy module làm key để gộp permissions
        const moduleKey = item.module || "OTHERS";
        
        if (!acc[moduleKey]) {
          acc[moduleKey] = [];
        }
        
        // Tạo action hiển thị đầy đủ: METHOD + Path
        const enrichedItem = {
          ...item,
          action: `${item.method} - ${item.path}`
        };
        
        acc[moduleKey].push(enrichedItem);
        return acc;
      }, {});
      
      setPermissionsData(groupedPermissions)
    } catch (error) {
      showToast(parseApiError(error), "error")
    } finally {
      setIsPermissionsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  // CRUD operations
  const addRole = async (data: RoleCreateRequest) => {
    try {
      const response = await roleService.create(data)
      showToast(response.message || "Tạo vai trò thành công", "success")
      refreshData()
      handleCloseUpsertModal()
      return response
    } catch (error) {
      showToast(parseApiError(error), "error")
      console.error("Lỗi khi tạo vai trò:", error)
      return null
    }
  }

  const editRole = async (id: number, data: RoleUpdateRequest) => {
    try {
      const response = await roleService.update(String(id), data)
      showToast(response.message || "Cập nhật vai trò thành công", "success")
      refreshData()
      handleCloseUpsertModal()
      return response
    } catch (error) {
      showToast(parseApiError(error), "error")
      console.error("Lỗi khi cập nhật vai trò:", error)
      return null
    }
  }

  const handleConfirmDelete = async (): Promise<void> => {
    if (roleToDelete) {
      setDeleteLoading(true)
      try {
        const response = await roleService.delete(String(roleToDelete.id))
        showToast(response.message || "Xóa vai trò thành công", "success")
        refreshData()
        handleCloseDeleteModal()
      } catch (error) {
        showToast(parseApiError(error), "error")
        console.error("Lỗi khi xóa vai trò:", error)
      } finally {
        setDeleteLoading(false)
      }
    }
  }

  // Modal handlers
  const handleOpenDelete = (role: Role) => {
    setRoleToDelete(role)
    setDeleteOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false)
    setRoleToDelete(null)
  }

  // Fetch role details by ID including permissions
  const fetchRoleDetails = async (roleId: number) => {
    try {
      setIsPermissionsLoading(true)
      const response = await roleService.getById(String(roleId))
      
      // Update roleToEdit with full details including permissions
      if (response) {
        // Extract the necessary data from the response and explicitly type as Role
        const roleData: Role = {
          id: Number(response.id),
          name: response.name,
          description: response.description || "",
          isActive: response.isActive ?? true,
          createdById: response.createdById,
          updatedById: response.updatedById,
          deletedById: response.deletedById,
          deletedAt: response.deletedAt,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          // Make sure permissions are properly mapped with correct ID type
          permissions: Array.isArray(response.permissions) 
            ? response.permissions.map(p => ({
                ...p,
                id: Number(p.id) // Ensure permission IDs are numbers
              }))
            : []
        }
        
        setRoleToEdit(roleData)
        
        // Log for debugging
        console.log("Fetched role details:", roleData)
        console.log("Permissions count:", roleData.permissions?.length || 0)
      }
    } catch (error) {
      showToast(parseApiError(error), "error")
      console.error("Lỗi khi lấy chi tiết vai trò:", error)
    } finally {
      setIsPermissionsLoading(false)
    }
  }
  
  const handleOpenUpsertModal = (mode: 'add' | 'edit', role?: Role) => {
    setModalMode(mode)
    
    if (mode === 'edit' && role) {
      console.log("Opening edit modal for role:", role)
      setRoleToEdit(role)
      // Fetch detailed role info including permissions
      fetchRoleDetails(role.id)
    } else {
      console.log("Opening add modal")
      setRoleToEdit(null)
    }
    
    setUpsertOpen(true)
  }

  const handleCloseUpsertModal = () => {
    setUpsertOpen(false)
    setRoleToEdit(null)
  }

  return {
    data: roles,
    loading,
    pagination,
    
    // Server-side pagination handlers
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
    
    // Delete
    deleteOpen,
    roleToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,

    // Upsert
    upsertOpen,
    modalMode,
    roleToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    addRole,
    editRole,
    fetchRoleDetails,

    // Permissions data
    permissionsData,
    isPermissionsLoading,
  }
}
