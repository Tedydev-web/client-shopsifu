import { useState, useCallback } from "react";
import { Permission } from "./permissions-Columns";
import { permissionService } from "@/services/permissionService";
import { showToast } from "@/components/ui/toastify";
import { parseApiError } from "@/utils/error";
import {
  PerCreateRequest,
  PerUpdateRequest,
  PermissionDetail,
} from "@/types/auth/permission.interface";
import { useServerDataTable } from "@/hooks/useServerDataTable";
import { createDataTableAdapter } from "@/utils/api-adapters";

export function usePermissions() {
  // Create an adapter for the permission service
  const permissionAdapter = createDataTableAdapter<PermissionDetail>(permissionService.getAll);

  // Setup our data table with the adapter
  const {
    data: permissions,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
  } = useServerDataTable<PermissionDetail, Permission>({
    fetchData: permissionAdapter,
    mapResponseToData: (item) => ({
      id: item.id,
      code: String(item.id),
      name: item.name,
      description: item.description,
      path: item.path,
      method: item.method,
      module: item.module,
      createdById: item.createdById,
      updatedById: item.updatedById,
      deletedById: item.deletedById,
      deletedAt: item.deletedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }),
    initialSort: { sortBy: "id", sortOrder: "asc" },
    defaultLimit: 10,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(
    null
  );

  const handleCreate = async (data: PerCreateRequest) => {
    try {
      await permissionService.create(data);
      showToast("Permission created successfully", "success");
      // Re-fetch the data by changing sort to force refresh
      handleSortChange(pagination.sortBy || "id", (pagination.sortOrder as "asc" | "desc") || "asc");
      handleCloseModal();
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  const handleUpdate = async (id: number, data: PerUpdateRequest) => {
    try {
      await permissionService.update(String(id), data);
      showToast("Permission updated successfully", "success");
      // Re-fetch the data by changing sort to force refresh
      handleSortChange(pagination.sortBy || "id", (pagination.sortOrder as "asc" | "desc") || "asc");
      handleCloseModal();
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await permissionService.delete(String(id));
      showToast("Permission deleted successfully", "success");
      // Re-fetch the data by changing sort to force refresh
      handleSortChange(pagination.sortBy || "id", (pagination.sortOrder as "asc" | "desc") || "asc");
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
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
