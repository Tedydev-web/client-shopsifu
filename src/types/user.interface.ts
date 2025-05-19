export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string; // Or Date, depending on your data
  lastLogin?: string; // Optional
} 