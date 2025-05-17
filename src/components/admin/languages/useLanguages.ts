import { useState } from "react"
import { Language } from "./languages-Columns"
import { languagesService } from "@/services/languagesService"
import { showToast } from "@/components/ui/toastify"
import { parseApiError } from "@/utils/error"
import { 
  LangCreateRequest, 
  LangUpdateRequest 
} from "@/types/languages.interface"

export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)

  // Get all languages
  const getAllLanguages = async () => {
    try {
      setLoading(true)
      const response = await languagesService.getAll()
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
      showToast('Language created successfully', 'success')
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
      showToast('Language updated successfully', 'success')
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
      showToast('Language deleted successfully', 'success')
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
