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
  totalPages: 1,
  totalItems: 0,
  hasNext: false,
  hasPrevious: false,
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
  const [refetchCount, setRefetchCount] = useState(0);

  const debouncedSearch = useDebounce(pagination?.search, 500);

  const refetch = () => setRefetchCount((prev) => prev + 1);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const requestParams: PaginationRequest = {
          page: pagination?.page,
          limit: pagination?.limit,
          search: debouncedSearch,
          sortBy: pagination?.sortBy,
          sortOrder: pagination?.sortOrder,
        };
        console.log("Fetching permissions with params:", requestParams);
        const response = await permissionService.getAll(requestParams);
        console.log("API Response:", response);

        // Kiểm tra cấu trúc response để xử lý đúng
        if (response && response.data) {
          const mappedPermissions: Permission[] = response.data.map((per) => ({
            id: per.id,
            code: String(per.id),
            name: per.name,
            description: per.description,
            path: per.path,
            method: per.method,
            module: per.module,
            createdById: per.createdById,
            updatedById: per.updatedById,
            deletedById: per.deletedById,
            deletedAt: per.deletedAt,
            createdAt: per.createdAt,
            updatedAt: per.updatedAt,
          }));

          console.log("Setting permissions:", mappedPermissions.length);
          setPermissions(mappedPermissions);
        }
        
        // Kiểm tra và log thông tin metadata
        console.log("Raw API metadata:", response.metadata);
        
        if (response && response.metadata) {
          console.log("Updating pagination with metadata:", response.metadata);
          const updatedPagination = {
            ...pagination,
            totalItems: response.metadata.totalItems,
            page: response.metadata.page,
            limit: response.metadata.limit,
            totalPages: response.metadata.totalPages,
            hasNext: response.metadata.hasNext,
            hasPrevious: response.metadata.hasPrevious,
          };
          console.log("Updated pagination:", updatedPagination);
          setPagination(updatedPagination);
        }
      } catch (error) {
        showToast(parseApiError(error), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [
    pagination?.page,
    pagination?.limit,
    debouncedSearch,
    pagination?.sortBy,
    pagination?.sortOrder,
    refetchCount,
  ]);

  const handleCreate = async (data: PerCreateRequest) => {
    try {
      await permissionService.create(data);
      showToast("Permission created successfully", "success");
      refetch();
      handleCloseModal();
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  const handleUpdate = async (id: number, data: PerUpdateRequest) => {
    try {
      await permissionService.update(String(id), data);
      showToast("Permission updated successfully", "success");
      refetch();
      handleCloseModal();
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await permissionService.delete(String(id));
      showToast("Permission deleted successfully", "success");
      refetch();
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  const handlePageChange = (page: number) => {
    console.log("Changing page to:", page);
    setPagination((prev) => ({ ...prev, page }));
    // No need to call setRefetchCount here as it will be triggered by the dependency on pagination.page
  };

  const handleLimitChange = (limit: number) => {
    console.log("Changing limit to:", limit);
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
    // Force a refetch when limit changes
    setRefetchCount(prev => prev + 1);
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