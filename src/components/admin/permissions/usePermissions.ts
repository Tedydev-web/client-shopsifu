import { useState, useCallback, useEffect } from "react";
import { Permission } from "./permissions-Columns";
import { permissionService } from "@/services/permissionService";
import { showToast } from "@/components/ui/toastify";
import { parseApiError } from "@/utils/error";
import {
  PerCreateRequest,
  PerUpdateRequest,
} from "@/types/auth/permission.interface";
import { useDebounce } from "@/hooks/useDebounce";

export function usePermissions() {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const getAllPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await permissionService.getAll();
      const flattenedPermissions = Object.entries(response.data).flatMap(
        ([subject, items]) =>
          items.map((item) => ({
            subject: subject,
            ...item,
          }))
      );
      const mappedPermissions: Permission[] = flattenedPermissions.map(
        (per) => ({
          id: per.id,
          code: String(per.id),
          name: per.description,
          description: per.description,
          path: per.subject,
          method: per.action,
        })
      );
      setAllPermissions(mappedPermissions);
      setPermissions(mappedPermissions);
    } catch (error) {
      showToast(parseApiError(error), "error");
      console.error("Error fetching permissions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      setIsSearching(true);
      const filteredData = allPermissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          permission.description
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          permission.path.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setPermissions(filteredData);
      setIsSearching(false);
    } else {
      setPermissions(allPermissions);
    }
  }, [debouncedSearch, allPermissions]);

  const createPermission = async (data: PerCreateRequest) => {
    try {
      const response = await permissionService.create(data);
      showToast("Tạo quyền thành công", "success");
      return response;
    } catch (error) {
      showToast(parseApiError(error), 'error');
      console.error('Error creating permission:', error);
      return null;
    }
  };

  const updatePermission = async (code: string, data: PerUpdateRequest) => {
    try {
      const response = await permissionService.update(code, data);
      showToast("Cập nhật quyền thành công", "success");
      return response;
    } catch (error) {
      showToast(parseApiError(error), 'error');
      console.error('Error updating permission:', error);
      return null;
    }
  };

  const deletePermission = async (id: string) => {
    try {
      const response = await permissionService.delete(id);
      showToast("Xóa quyền thành công", "success");
      return response;
    } catch (error) {
      showToast(parseApiError(error), 'error');
      console.error('Error deleting permission:', error);
      return null;
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleOpenModal = useCallback((permission?: Permission) => {
    setSelectedPermission(permission || null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPermission(null);
  }, []);

  return {
    permissions,
    loading,
    isSearching,
    search,
    handleSearch,
    isModalOpen,
    selectedPermission,
    getAllPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    handleOpenModal,
    handleCloseModal,
  };
}