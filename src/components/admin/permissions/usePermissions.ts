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
import {
  PaginationRequest,
  PaginationMetadata,
} from "@/types/base.interface";

const INITIAL_PAGINATION: PaginationMetadata = {
  page: 1,
  limit: 10,
  search: "",
  sortBy: "id",
  sortOrder: "asc",
};

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [pagination, setPagination] =
    useState<PaginationMetadata>(INITIAL_PAGINATION);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(
    null
  );
  const [loading, setLoading] = useState(false);


  const debouncedSearch = useDebounce(pagination?.search, 500);

  const getAllPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const requestParams: PaginationRequest = {
        page: pagination?.page,
        limit: pagination?.limit,
        search: debouncedSearch,
        sortBy: pagination?.sortBy,
        sortOrder: pagination?.sortOrder,
      };
      const response = await permissionService.getAll(requestParams);

      const mappedPermissions: Permission[] = response.data.map((per) => ({
        id: per.id,
        code: String(per.id),
        name: per.name,
        description: per.description,
        path: per.path,
        method: per.method,
      }));

      setPermissions(mappedPermissions);
      if (response.metadata) {
        setPagination(response.metadata);
      }
    } catch (error) {
      showToast(parseApiError(error), "error");
    } finally {
      setLoading(false);
    }
  }, [
    pagination?.page,
    pagination?.limit,
    debouncedSearch,
    pagination?.sortBy,
    pagination?.sortOrder,
  ]);

  useEffect(() => {
    getAllPermissions();
  }, [getAllPermissions]);

  const handleCreate = async (data: PerCreateRequest) => {
    try {
      await permissionService.create(data);
      showToast("Permission created successfully", "success");
      getAllPermissions();
      handleCloseModal();
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  const handleUpdate = async (id: number, data: PerUpdateRequest) => {
    try {
      await permissionService.update(String(id), data);
      showToast("Permission updated successfully", "success");
      getAllPermissions();
      handleCloseModal();
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await permissionService.delete(String(id));
      showToast("Permission deleted successfully", "success");
      getAllPermissions();
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleSearch = (search: string) => {
    setPagination((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleOpenModal = (permission: Permission | null = null) => {
    setSelectedPermission(permission);
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPermission(null);
  }, []);

  return {
    permissions,
    loading,
    pagination,
    isModalOpen,
    selectedPermission,
    getAllPermissions,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleOpenModal,
    handleCloseModal,
    handlePageChange,
    handleLimitChange,
    handleSearch,
  };
}