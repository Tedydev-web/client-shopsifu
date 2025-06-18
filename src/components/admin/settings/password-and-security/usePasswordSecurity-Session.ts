'use client'

import { useState, useEffect, useCallback } from 'react'
import { sessionService } from '@/services/auth/sessionService'
import { SessionGetALLResponse, Device } from '@/types/auth/session.interface'

export interface GroupedDevice {
  os: string
  totalSessions: number
  devices: Device[]
}

export const usePasswordSecuritySession = () => {
  const [groupedDevices, setGroupedDevices] = useState<GroupedDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10) // Default limit
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true)
      // The PaginationRequest interface was modified to represent response metadata.
      // We pass page and limit directly, casting to `any` to bypass the type mismatch
      // as the backend expects top-level `page` and `limit` query parameters.
      const response = await sessionService.getAll({ page, limit } as any)

      // The response data is now strictly typed as Device[]
      const devicesFromApi: Device[] = response.data || []

      const groups: { [key: string]: GroupedDevice } = {}

      devicesFromApi.forEach(device => {
        const osKey = device.os || 'Unknown'
        if (!groups[osKey]) {
          groups[osKey] = { os: osKey, totalSessions: 0, devices: [] }
        }
        groups[osKey].devices.push(device)
        // Use the totalSessions from the device data, or count the sessions array
        groups[osKey].totalSessions += device.totalSessions || device.sessions?.length || 0
      })

      setGroupedDevices(Object.values(groups))

      if (response.metadata) {
        setTotalPages(response.metadata.totalPages)
        setTotalItems(response.metadata.totalItems)
      }
    } catch (err) {
      setError('Failed to fetch session data.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to page 1 when limit changes
  };

  return { groupedDevices, loading, error, page, limit, totalPages, totalItems, handlePageChange, handleLimitChange }
}