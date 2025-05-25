import { useState } from "react"
import { roleService } from "@/services/roleService"
import { showToast } from "@/components/ui/toastify"
import { parseApiError } from "@/utils/error"
import {
  RoleResponse,
  RoleCreateRequest,
  RoleUpdateRequest,
} from "@/types/role.interface"
import { PaginationRequest } from "@/types/base.interface"

export function useRoles() {
  const [roles, setRoles] = useState<RoleResponse[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [page, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Lấy danh sách role với phân trang
  const getAllRoles = async (params?: PaginationRequest) => {
    try {
      setLoading(true)
      const response = await roleService.getAll(params)
      // response.data là mảng RoleResponse hoặc kiểu tương tự
      const mappedRoles: RoleResponse[] = response.data.map((role: any) => ({
        id: String(role.id),
        name: role.name,
        description: role.description || "",
        isActive: role.isActive ?? true,
        permissions: role.permissions || [],
        role: role.role || "", // nếu API có trường này, không thì để chuỗi rỗng
        createdAt: typeof role.createdAt === "string" ? Number(new Date(role.createdAt)) : Number(role.createdAt),
        updatedAt: typeof role.updatedAt === "string" ? Number(new Date(role.updatedAt)) : Number(role.updatedAt),
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
  }

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
      showToast("Tạo vai trò thành công", "success")
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
      showToast("Cập nhật vai trò thành công", "success")
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
      showToast("Xóa vai trò thành công", "success")
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
  const handleOpenModal = (role?: RoleResponse) => {
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
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    handleOpenModal,
    handleCloseModal,
    setCurrentPage,
  }
}
