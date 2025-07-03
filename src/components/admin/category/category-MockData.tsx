import { ICategory } from "@/types/admin/category.interface";
import { CategoryTableData } from "./category-Columns";

export const mockCategoryData: CategoryTableData[] = [
  {
    id: "1",
    name: "Electronics",
    description: "All electronic gadgets",
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-06-20T14:20:00Z",
  },
  {
    id: "2",
    name: "Smartphones",
    description: "Mobile phones and accessories from leading brands",
    isActive: true,
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-06-18T11:30:00Z",
  },
  {
    id: "3",
    name: "Laptops",
    description: "Portable computers and accessories for work and gaming",
    isActive: true,
    createdAt: "2024-01-16T09:20:00Z",
    updatedAt: "2024-06-19T16:45:00Z",
  },
  {
    id: "4",
    name: "Fashion",
    description: "Clothing and accessories for men, women and children",
    isActive: true,
    createdAt: "2024-01-20T14:00:00Z",
    updatedAt: "2024-06-21T09:15:00Z",
  },
  
];

