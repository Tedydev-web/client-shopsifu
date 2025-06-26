'use client'

import { useState } from "react"
import { Brand } from "./brand-Columns"
import { mockBrandData, searchBrands } from "./brand-MockData"

export const useBrand = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [currentSearchQuery, setCurrentSearchQuery] = useState("")

  const getAllBrands = async ({ metadata }: { metadata: { page: number; limit: number } }) => {
    try {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Get filtered data based on search query
      let filteredData = currentSearchQuery 
        ? searchBrands(currentSearchQuery)
        : mockBrandData
      
      // Paginate the data
      const startIndex = (metadata.page - 1) * metadata.limit
      const endIndex = startIndex + metadata.limit
      const paginatedData = filteredData.slice(startIndex, endIndex)
      
      // Update state
      setBrands(paginatedData)
      setTotalItems(filteredData.length)
      setTotalPages(Math.ceil(filteredData.length / metadata.limit))
      setPage(metadata.page)
      
    } catch (error) {
      console.error('Error fetching brands:', error)
      setBrands([])
      setTotalItems(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  const deleteBrand = async (code: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Remove from mock data
      const index = mockBrandData.findIndex(brand => brand.code === code)
      if (index > -1) {
        mockBrandData.splice(index, 1)
      }
      
      return true
    } catch (error) {
      console.error('Error deleting brand:', error)
      return false
    }
  }

  const createBrand = async (brandData: { 
    code: string; 
    name: string; 
    description?: string;
    logo?: string;
    website?: string;
    country?: string;
    status?: "active" | "inactive";
  }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Create new brand object
      const newBrand: Brand = {
        id: mockBrandData.length + 1,
        code: brandData.code,
        name: brandData.name,
        description: brandData.description || "",
        logo: brandData.logo || "",
        website: brandData.website || "",
        country: brandData.country || "",
        status: brandData.status || "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Add to mock data
      mockBrandData.push(newBrand)
      
      return true
    } catch (error) {
      console.error('Error creating brand:', error)
      return false
    }
  }

  const updateBrand = async (code: string, brandData: { 
    name?: string;
    description?: string;
    logo?: string;
    website?: string;
    country?: string;
    status?: "active" | "inactive";
  }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Find and update brand in mock data
      const brandIndex = mockBrandData.findIndex(brand => brand.code === code)
      if (brandIndex > -1) {
        mockBrandData[brandIndex] = {
          ...mockBrandData[brandIndex],
          ...brandData,
          updatedAt: new Date().toISOString()
        }
      }
      
      return true
    } catch (error) {
      console.error('Error updating brand:', error)
      return false
    }
  }

  const handleOpenModal = (brand?: Brand) => {
    setSelectedBrand(brand || null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedBrand(null)
  }

  const handleSearch = (query: string) => {
    setCurrentSearchQuery(query)
  }

  return {
    brands,
    totalItems,
    page,
    totalPages,
    loading,
    isModalOpen,
    selectedBrand,
    getAllBrands,
    deleteBrand,
    createBrand,
    updateBrand,
    handleOpenModal,
    handleCloseModal,
    handleSearch,
  }
}
