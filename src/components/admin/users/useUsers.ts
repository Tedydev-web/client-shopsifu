import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/admin/user.interface';
import { userService } from '@/services/admin/userService';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function useUsers() {
  const { t } = useTranslation();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination and search state
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAll({});
      setAllUsers(response.data || []);
    } catch (err) {
      setError('Failed to fetch users');
      toast.error(t('admin.users.toasts.fetchError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Client-side filtering and pagination
  useEffect(() => {
    const filtered = allUsers.filter(u => {
      const username = (u.userProfile?.username || '').toLowerCase();
      const email = u.email.toLowerCase();
      const searchTerm = search.toLowerCase();
      return username.includes(searchTerm) || email.includes(searchTerm);
    });
    setTotalRecords(filtered.length);
    const offset = (currentPage - 1) * limit;
    setData(filtered.slice(offset, offset + limit));
  }, [allUsers, search, limit, currentPage]);

  // CRUD operations
  const addUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => { console.log('add', user); };
  const editUser = (user: User) => { console.log('edit', user); };

  // Delete state and handlers
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleOpenDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      setDeleteLoading(true);
      try {
        await userService.delete(userToDelete.id);
        toast.success(t('admin.users.toasts.deleteSuccess'));
        fetchUsers(); // Refetch data
      } catch (error) {
        toast.error(t('admin.users.toasts.deleteError'));
        console.error(error);
      } finally {
        setDeleteLoading(false);
        setDeleteOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const handleCloseDeleteModal = () => setDeleteOpen(false);

  // Edit state and handlers
  const [editOpen, setEditOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const handleOpenEdit = (user: User) => {
    setUserToEdit(user);
    setEditOpen(true);
  };

  const handleOpenCreate = () => {
    setUserToEdit(null);
    setEditOpen(true);
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page
  };

  return {
    data,
    totalRecords,
    loading,
    error,
    limit,
    search,
    setSearch,
    currentPage,
    totalPages: Math.ceil(totalRecords / limit),
    addUser,
    editUser,
    deleteOpen,
    userToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    editOpen,
    userToEdit,
    handleOpenEdit,
    handleOpenCreate,
    setEditOpen,
    handlePageChange,
    handleLimitChange,
    handleCloseDeleteModal,
    refetch: fetchUsers,
  };
}
