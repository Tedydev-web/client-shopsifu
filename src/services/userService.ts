// Mock Sservice for fetching users
import { User } from '@/types/user.interface';

interface FetchUsersParams {
  limit: number;
  offset: number;
  // Add other filter/sort params as needed
}

interface FetchUsersResponse {
  data: User[];
  total: number;
}

const allMockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `Người dùng ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'editor' : 'user',
  status: i % 4 === 0 ? 'active' : i % 4 === 1 ? 'pending' : 'inactive',
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  lastLogin: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
}));

export const fetchUsers = async ({ limit, offset }: FetchUsersParams): Promise<FetchUsersResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const data = allMockUsers.slice(offset, offset + limit);
  return {
    data,
    total: allMockUsers.length,
  };
}; 