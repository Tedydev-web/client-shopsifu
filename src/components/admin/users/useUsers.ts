import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { userService } from '@/services/admin/userService';
import { roleService } from '@/services/roleService'; // Import roleService
import { User, UserCreateRequest } from '@/types/admin/user.interface';
import { Role } from '@/types/auth/role.interface'; // Import Role type

export const useUsers = () => {
  const { t } = useTranslation('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  // Modal states
  const [upsertOpen, setUpsertOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Roles state
  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = async () => {
    try {
      const response = await roleService.getAll({ "all-records": true });
      setRoles(response.data);
    } catch (err) {
      toast.error(t('admin.users.toasts.fetchRolesError', 'Failed to fetch roles'));
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAll({ page: 1, limit: 1000, "all-records": true }); // Fetch all for client-side pagination
      setAllUsers(response.data);
      setError(null);
    } catch (err) {
      setError(t('admin.users.toasts.fetchError'));
      toast.error(t('admin.users.toasts.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Client-side filtering and pagination
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user =>
      (user.userProfile?.username?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(search.toLowerCase())
    );
  }, [allUsers, search]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * limit;
    const end = start + limit;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage, limit]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredUsers.length / limit);
  }, [filteredUsers, limit]);

  // CRUD operations
  const addUser = async (user: UserCreateRequest) => {
    try {
      await userService.create(user);
      toast.success(t('admin.users.toasts.createSuccess'));
      fetchUsers();
    } catch (error) {
      toast.error(t('admin.users.toasts.createError'));
      console.error(error);
    }
  };

  const editUser = async (user: User) => {
    try {
      await userService.update(user.id, user);
      toast.success(t('admin.users.toasts.updateSuccess'));
      fetchUsers();
    } catch (error) {
      toast.error(t('admin.users.toasts.updateError'));
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      setDeleteLoading(true);
      try {
        await userService.delete(userToDelete.id);
        toast.success(t('admin.users.toasts.deleteSuccess'));
        fetchUsers();
        setDeleteOpen(false);
        setUserToDelete(null);
      } catch (error) {
        toast.error(t('admin.users.toasts.deleteError'));
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  // Handlers
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleLimitChange = (limit: number) => {
    setLimit(limit);
    setCurrentPage(1);
  };
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleOpenDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
    setUserToDelete(null);
  };

  const handleOpenUpsertModal = (mode: 'add' | 'edit', user?: User) => {
    setModalMode(mode);
    setUserToEdit(user || null);
    setUpsertOpen(true);
  };

  const handleCloseUpsertModal = () => {
    setUpsertOpen(false);
    setUserToEdit(null);
  };

  return {
    data: paginatedUsers,
    totalRecords: filteredUsers.length,
    loading,
    error,
    limit,
    currentPage,
    totalPages,
    search,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    isSearching,
    // Delete
    deleteOpen,
    userToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,

    // Upsert
    upsertOpen,
    modalMode,
    userToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    addUser,
    editUser,

    // Data for dropdowns
    roles
  };
};
