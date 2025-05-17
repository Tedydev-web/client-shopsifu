'use client'

import { useState } from 'react'
import { DataTable, getColumns } from "@/components/admin/product/dataTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"


// Interface cho dữ liệu sản phẩm
interface Product {
  id: string
  image: string
  name: string
  category: string
  price: number
  stock: number
  status: string
}

export default function ProductsPage() {
  const { t } = useTranslation()
  const columns = getColumns(t) // Lấy các cột từ hàm getColumns
  // Mock data - sẽ được thay thế bằng dữ liệu thật từ API
  const [products] = useState<Product[]>([
    {
      id: "1",
      image: "/images/logo/logofullred.png",
      name: "Sản phẩm mẫu 1",
      category: "Danh mục 1",
      price: 100000,
      stock: 10,
      status: "Còn hàng"
    },
    {
      id: "2",
      image: "/images/logo/logofullred.png",
      name: "Sản phẩm mẫu 2",
      category: "Danh mục 2",
      price: 200000,
      stock: 5,
      status: "Còn hàng"
    },
    // Thêm nhiều sản phẩm mẫu khác...
  ])

  // Mock categories data - sẽ được thay thế bằng dữ liệu thật từ API
  const [categories] = useState([
    { id: "1", name: "Danh mục 1" },
    { id: "2", name: "Danh mục 2" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('admin.product.product')}</h2>
          <p className="text-muted-foreground">
            {t('admin.product.Manage all your products here')}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.product.addProduct')}
        </Button>
      </div>
      <DataTable columns={columns} data={products} categories={categories} />
    </div>
  )
}