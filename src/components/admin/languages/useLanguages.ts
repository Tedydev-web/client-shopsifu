import { useState } from "react"
import { Language } from "./languages-Columns"
import { languagesService } from "@/services/languagesService"
import { showToast } from "@/components/ui/toastify"
import { parseApiError } from "@/utils/error"
import { 
  LangCreateRequest, 
  LangUpdateRequest,
  LangGetAllResponse
} from "@/types/languages.interface"
import { PaginationRequest } from "@/types/base.interface"
import { t } from "i18next"

export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [page, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Get all languages
  const getAllLanguages = async (params?: PaginationRequest) => {
    try {
      setLoading(true)
      const response = await languagesService.getAll(params)
      // Map API response to Language type
      const mappedLanguages: Language[] = response.data.map(lang => ({
        id: parseInt(lang.id),
        code: lang.id, // Using id as code
        name: lang.name,
        isActive: true, // Default value
        createdAt: lang.createdAt,
        updatedAt: lang.updatedAt
      }))
      setLanguages(mappedLanguages)
      setTotalItems(response.totalItems)
      setCurrentPage(response.page)
      setTotalPages(response.totalPages)
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Error fetching languages:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get language by ID
  const getLanguageById = async (id: string) => {
    try {
      setLoading(true)
      const response = await languagesService.getById(id)
      return response
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Error fetching language:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Create new language
  const createLanguage = async (data: LangCreateRequest) => {
    try {
      setLoading(true)
      const response = await languagesService.create(data)
      showToast(t('admin.showToast.language.createSuccessful'), "success")
      return response
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Error creating language:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Update language
  const updateLanguage = async (id: string, data: LangUpdateRequest) => {
    try {
      setLoading(true)
      const response = await languagesService.update(id, data)
      showToast(t('admin.showToast.language.updateSuccessful'), "success")
      return response
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Error updating language:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Delete language
  const deleteLanguage = async (id: string) => {
    try {
      setLoading(true)
      const response = await languagesService.deleteById(id)
      showToast(t('admin.showToast.language.deleteSuccessful'), "success")
      return response
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Error deleting language:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (language?: Language) => {
    if (language) {
      setSelectedLanguage(language)
    } else {
      setSelectedLanguage(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedLanguage(null)
  }

  return {
    languages,
    totalItems,
    page,
    totalPages,
    isModalOpen,
    selectedLanguage,
    loading,
    // API handlers
    getAllLanguages,
    getLanguageById,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    // UI handlers
    handleOpenModal,
    handleCloseModal,
  }
}
