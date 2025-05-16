import { useState } from "react"
import { languagesMockData } from "./languages-MockData"
import { Language } from "./languages-Columns"

export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>(languagesMockData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)

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

  const handleSubmit = async (values: {
    code: string
    name: string
    isActive: boolean
  }) => {
    try {
      if (selectedLanguage) {
        // Update existing language
        setLanguages(prev =>
          prev.map(lang =>
            lang.id === selectedLanguage.id
              ? {
                  ...lang,
                  ...values,
                  updatedAt: new Date().toISOString(),
                }
              : lang
          )
        )
      } else {
        // Add new language
        const newLanguage: Language = {
          id: languages.length + 1,
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setLanguages(prev => [...prev, newLanguage])
      }
    } catch (error) {
      console.error("Error saving language:", error)
      throw error
    }
  }

  const handleDelete = async (id: number) => {
    try {
      setLanguages(prev => prev.filter(lang => lang.id !== id))
    } catch (error) {
      console.error("Error deleting language:", error)
      throw error
    }
  }

  return {
    languages,
    isModalOpen,
    selectedLanguage,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
  }
}
