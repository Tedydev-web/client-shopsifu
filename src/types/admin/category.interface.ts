export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId: string | null;
  lft: number;
  rgt: number;
  sortOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  children?: ICategory[];
}
