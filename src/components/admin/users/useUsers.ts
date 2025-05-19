import { useState, useEffect } from 'react';
import { User } from '@/types/user.interface';
import { mockUsers } from './users-MockData';

export function useUsers() {
  // State users và các state liên quan
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [data, setData] = useState<User[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');

  // State cho popup xóa
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State cho popup edit
  const [editOpen, setEditOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Lấy danh sách users (có thể filter theo search)
  const fetchUsers = () => {
    setLoading(true);
    let filtered = users;
    if (search) {
      filtered = users.filter(
        u =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    setTotalRecords(filtered.length);
    setData(filtered.slice(offset, offset + limit));
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [users, limit, offset, search]);

  // Thêm user mới
  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: (Date.now() + Math.random()).toString(),
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [newUser, ...prev]);
    return newUser;
  };

  // Sửa user
  const editUser = (user: User) => {
    setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, ...user } : u)));
  };

  // Xóa user
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Handle mở popup xóa
  const handleOpenDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteOpen(true);
  };

  // Handle xác nhận xóa
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);
    await new Promise(r => setTimeout(r, 800)); // giả lập delay
    deleteUser(userToDelete.id);
    setDeleteLoading(false);
    setDeleteOpen(false);
    setUserToDelete(null);
  };

  // Handle mở popup edit
  const handleOpenEdit = (user: User) => {
    setUserToEdit(user);
    setEditOpen(true);
  };

  // Handle phân trang
  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setOffset(0);
  };

  // Handle đóng popup xóa
  const handleCloseDeleteModal = () => setDeleteOpen(false);

  return {
    data,
    totalRecords,
    loading,
    limit,
    offset,
    search,
    setSearch,
    currentPage: offset / limit + 1,
    totalPages: Math.ceil(totalRecords / limit),
    // CRUD
    addUser,
    editUser,
    deleteUser,
    // Modal state & handle
    deleteOpen,
    userToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    editOpen,
    userToEdit,
    handleOpenEdit,
    setEditOpen,
    // Paging
    handlePageChange,
    handleLimitChange,
    handleCloseDeleteModal,
  };
}
