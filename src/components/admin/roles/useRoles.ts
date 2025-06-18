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
import { PerGetAllResponse } from "@/types/auth/permission.interface"
import { PaginationRequest } from "@/types/base.interface"
import { Role } from "./roles-Columns"
import { string } from "zod"
import { t } from "i18next"

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [page, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [permissionsData, setPermissionsData] = useState<PerGetAllResponse['data']>({});
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);

  const fetchRoles = useCallback(async (params?: PaginationRequest) => {
    try {
      setLoading(true)
      const response: RoleGetAllResponse = await roleService.getAll(params);
      const mappedRoles: Role[] = response.data.map(role => ({
        ...role,
        id: Number(role.id),
        description: role.description || "",
        isActive: role.isActive ?? true,
      }))
      setRoles(mappedRoles)
      setTotalItems(response.totalItems)
      setCurrentPage(response.page)
      setTotalPages(response.totalPages)
    } catch (error) {
      showToast(parseApiError(error), "error")
      console.error("Lỗi khi lấy danh sách vai trò:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPermissions = useCallback(async () => {
    try {
      setIsPermissionsLoading(true);
      const response = await permissionService.getAll();
      setPermissionsData(response.data);
    } catch (error) {
      showToast("Không thể tải danh sách quyền", "error");
    } finally {
      setIsPermissionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles()
    fetchPermissions();
  }, [fetchRoles, fetchPermissions])

  // Lấy role theo id
  const getRoleById = async (id: number) => {
    try {
      setLoading(true)
      return await roleService.getById(String(id))
    } catch (error) {
      showToast(parseApiError(error), "error")
      console.error("Lỗi khi lấy vai trò:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Tạo mới role
  const createRole = async (data: RoleCreateRequest) => {
    try {
      setLoading(true)
      const response = await roleService.create(data)
      showToast(response.message || "Tạo vai trò thành công", "success")
      return response
    } catch (error) {
      showToast(parseApiError(error), "error")
      console.error("Lỗi khi tạo vai trò:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Cập nhật role
  const updateRole = async (id: number, data: RoleUpdateRequest) => {
    try {
      setLoading(true)
      const response = await roleService.update(String(id), data)
      showToast(response.message || "Cập nhật vai trò thành công", "success")
      return response
    } catch (error) {
      showToast(parseApiError(error), "error")
      console.error("Lỗi khi cập nhật vai trò:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Xóa role
  const deleteRole = async (id: number) => {
    try {
      setLoading(true)
      const response = await roleService.delete(String(id))
      showToast(response.message || "Xóa vai trò thành công", "success")
      return response
    } catch (error) {
      showToast(parseApiError(error), "error")
      console.error("Lỗi khi xóa vai trò:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Mở modal tạo hoặc sửa role
  const handleOpenModal = (role?: Role) => {
    if (role) {
      setSelectedRole(role)
    } else {
      setSelectedRole(null)
    }
    setIsModalOpen(true)
  }

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  return {
    roles,
    totalItems,
    page,
    totalPages,
    isModalOpen,
    selectedRole,
    loading,
    permissionsData,
    isPermissionsLoading,
    fetchRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    handleOpenModal,
    handleCloseModal,
    setCurrentPage,
  }
}
