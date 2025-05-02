// sidebaritem.tsx
'use client';
import { SidebarItem, SubItem } from './sidebarcomponents';
import { Home, ShoppingCart, Users } from 'lucide-react';

export const DashboardItem = () => (
  <SidebarItem href="/admin/dashboard" icon={<Home size={18} />} label="Dashboard" />
);

export const ProductItem = () => (
  <SidebarItem icon={<ShoppingCart size={18} />} label="Products">
    <SubItem href="/admin/product" label="Products" />
    <SubItem href="/admin/products/add" label="Add Product" />
    <SubItem href="/admin/products/categories" label="Product Categories" />
  </SidebarItem>
);

export const UserItem = () => (
  <SidebarItem href="/admin/users" icon={<Users size={18} />} label="Users" />
);
