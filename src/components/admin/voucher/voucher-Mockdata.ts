import { Voucher, DiscountType, DiscountStatus, DiscountApplyType } from '@/types/admin/voucher.interface';
import { BaseEntity } from '@/types/base.interface';

// Mock data cho vouchers
export const mockVouchers: Voucher[] = [
  {
    id: '1',
    code: 'SUMMER2025',
    name: 'Summer Sale 2025',
    description: 'Ưu đãi mùa hè giảm 20% cho tất cả sản phẩm',
    discountType: 'PERCENTAGE' as DiscountType,
    discountValue: 20,
    minOrderValue: 100000,
    maxDiscountValue: 500000,
    usageLimit: 100,
    usageCount: 35,
    validFrom: new Date('2025-06-01').toISOString(),
    validTo: new Date('2025-08-31').toISOString(),
    status: 'ACTIVE' as DiscountStatus,
    discountApplyType: 'ALL' as DiscountApplyType,
    discountStatus: 'ACTIVE' as DiscountStatus,
    type: 'PUBLIC',
    conditions: {
      productIds: [],
      categoryIds: []
    },
    createdAt: new Date('2025-05-01').toISOString(),
    updatedAt: new Date('2025-05-01').toISOString()
  },
  {
    id: '2',
    code: 'WELCOME50',
    name: 'Welcome Offer',
    description: 'Ưu đãi chào mừng cho khách hàng mới, giảm 50.000₫',
    discountType: 'FIXED_AMOUNT' as DiscountType,
    discountValue: 50000,
    minOrderValue: 200000,
    maxDiscountValue: 50000,
    usageLimit: 1,
    usageCount: 420,
    validFrom: new Date('2025-01-01').toISOString(),
    validTo: new Date('2025-12-31').toISOString(),
    status: 'ACTIVE' as DiscountStatus,
    discountApplyType: 'ALL' as DiscountApplyType,
    discountStatus: 'ACTIVE' as DiscountStatus,
    type: 'PRIVATE',
    conditions: {
      productIds: [],
      categoryIds: []
    },
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString()
  },
  {
    id: '3',
    code: 'FLASH25',
    name: 'Flash Sale 25%',
    description: 'Giảm giá nhanh 25% trong 24h',
    discountType: 'PERCENTAGE' as DiscountType,
    discountValue: 25,
    minOrderValue: 0,
    maxDiscountValue: 300000,
    usageLimit: 50,
    usageCount: 50,
    validFrom: new Date('2025-07-15').toISOString(),
    validTo: new Date('2025-07-16').toISOString(),
    status: 'EXPIRED' as DiscountStatus,
    discountApplyType: 'SPECIFIC_PRODUCTS' as DiscountApplyType,
    discountStatus: 'EXPIRED' as DiscountStatus,
    type: 'PUBLIC',
    conditions: {
      productIds: ['p1', 'p2', 'p3'],
      categoryIds: []
    },
    createdAt: new Date('2025-07-10').toISOString(),
    updatedAt: new Date('2025-07-10').toISOString()
  },
  {
    id: '4',
    code: 'TECH15',
    name: 'Tech Discount',
    description: 'Giảm 15% cho danh mục công nghệ',
    discountType: 'PERCENTAGE' as DiscountType,
    discountValue: 15,
    minOrderValue: 500000,
    maxDiscountValue: 1000000,
    usageLimit: 200,
    usageCount: 45,
    validFrom: new Date('2025-06-01').toISOString(),
    validTo: new Date('2025-09-30').toISOString(),
    status: 'INACTIVE' as DiscountStatus,
    discountApplyType: 'SPECIFIC_CATEGORIES' as DiscountApplyType,
    discountStatus: 'INACTIVE' as DiscountStatus,
    type: 'PUBLIC',
    conditions: {
      productIds: [],
      categoryIds: ['c1', 'c2']
    },
    createdAt: new Date('2025-05-20').toISOString(),
    updatedAt: new Date('2025-05-28').toISOString()
  },
  {
    id: '5',
    code: 'VIP100K',
    name: 'VIP Discount',
    description: 'Giảm 100.000₫ cho khách hàng VIP',
    discountType: 'FIXED_AMOUNT' as DiscountType,
    discountValue: 100000,
    minOrderValue: 1000000,
    maxDiscountValue: 100000,
    usageLimit: 10,
    usageCount: 3,
    validFrom: new Date('2025-01-01').toISOString(),
    validTo: new Date('2025-12-31').toISOString(),
    status: 'ACTIVE' as DiscountStatus,
    discountApplyType: 'ALL' as DiscountApplyType,
    discountStatus: 'ACTIVE' as DiscountStatus,
    type: 'PRIVATE',
    conditions: {
      productIds: [],
      categoryIds: []
    },
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString()
  }
];

// Metadata giả cho phân trang
export const mockPagination = {
  total: mockVouchers.length,
  page: 1,
  limit: 10,
  totalPages: 1
};
