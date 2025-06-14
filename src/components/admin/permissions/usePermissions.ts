import { useState } from "react";
import { Permission } from "./permissions-Columns";
import { permissionService } from "@/services/permissionService";
import { showToast } from "@/components/ui/toastify";
import { parseApiError } from "@/utils/error";
import {
  PerCreateRequest,
  PerUpdateRequest,
  PerGetAllResponse,
} from "@/types/permission.interface";
import { PaginationRequest } from "@/types/base.interface";
import { Code } from "lucide-react";

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Get all permissions with pagination
  const getAllPermissions = async (params?: PaginationRequest) => {
    try {
      setLoading(true);
      const response = await permissionService.getAll(params);

      const flattenedPermissions = Object.entries(response.data).flatMap(([subject, items]) =>
        items.map(item => ({
          subject: subject,
          ...item
        }))
      );

      const mappedPermissions: Permission[] = flattenedPermissions.map(per => ({
        id: per.id,
        code: String(per.id),
        name: per.description,
        description: per.description,
        path: per.subject,
        method: per.action,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      }));

      setPermissions(mappedPermissions);
      setTotalItems(response.meta.totalItems);
      setCurrentPage(response.meta.currentPage);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      showToast(parseApiError(error), 'error');
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPermissionById = async (id: string) => {
    try {
      setLoading(true);
      const response = await permissionService.getById(id);
      return response;
    } catch (error) {
      showToast(parseApiError(error), 'error');
      console.error('Error fetching permission:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createPermission = async (data: PerCreateRequest) => {
    try {
      setLoading(true);
      const response = await permissionService.create(data);
      showToast("Tạo quyền thành công", "success");
      return response;
    } catch (error) {
      showToast(parseApiError(error), 'error');
      console.error('Error creating permission:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (code: string, data: PerUpdateRequest) => {
    try {
      setLoading(true);
      // Tìm permission theo code để lấy id
      const permission = permissions.find(p => p.code === code);
      if (!permission) {
        showToast("Không tìm thấy quyền để cập nhật", "error");
        return null;
      }
      const response = await permissionService.update(code, data);
      showToast("Cập nhật quyền thành công", "success");
      return response;
    } catch (error) {
      showToast(parseApiError(error), 'error');
      console.error('Error updating permission:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePermission = async (id: string) => {
    try {
      setLoading(true);
      const response = await permissionService.delete(id);
      showToast("Xóa quyền thành công", "success");
      return response;
    } catch (error) {
      showToast(parseApiError(error), 'error');
      console.error('Error deleting permission:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (permission?: Permission) => {
    if (permission) {
      setSelectedPermission(permission);
    } else {
      setSelectedPermission(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPermission(null);
  };

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
    setCurrentPage,
  };
}