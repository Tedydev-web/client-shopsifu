'use client'

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/data-table/data-table'
import { Pagination } from '@/components/ui/data-table/pagination'
import { userColumns } from './user-columns'
import { fetchUsers } from '@/services/userService'
import { User } from '@/types/user.interface'

export default function UserTable() {
  const [data, setData] = useState<User[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [loading, setLoading] = useState(true)

  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)

  const currentPage = offset / limit + 1
  const totalPages = Math.ceil(totalRecords / limit)

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchUsers({ limit, offset })
        setData(res.data)
        setTotalRecords(res.total)
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setData([]);
        setTotalRecords(0);
      }
      setLoading(false);
    }
    load()
  }, [limit, offset])

  if (loading) {
    return <div>Đang tải dữ liệu người dùng...</div>
  }

  return (
    <div className="space-y-4">
      <DataTable columns={userColumns} data={data} />
      {totalPages > 0 && (
        <Pagination
          limit={limit}
          offset={offset}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={(newOffset, newPage) => setOffset(newOffset)}
          onLimitChange={(newLimit) => {
            setLimit(newLimit)
            setOffset(0)
          }}
        />
      )}
    </div>
  )
}
