import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useUploadMedia } from '@/hooks/useUploadMedia';
import { toast } from 'sonner';

interface ImageObject {
  id: string; 
  url: string; 
  file?: File; 
  progress: number; 
}

interface UseMediaFormProps {
  initialImageUrls: string[];
}

export function useMediaForm({ initialImageUrls }: UseMediaFormProps) {
  const [imageObjects, setImageObjects] = useState<ImageObject[]>(() => 
    initialImageUrls.map(url => ({ id: url, url, progress: 100 }))
  );

  const { uploadedUrls, isUploading, progress: overallProgress, handleAddFiles, uploadFiles, handleRemoveFile } = useUploadMedia();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

  // Sync parent's URL changes back to our internal state (more robustly)
  useEffect(() => {
    setImageObjects(currentObjects => {
      // Keep files that are currently uploading
      const uploadingObjects = currentObjects.filter(o => o.file);
      const uploadingUrls = new Set(uploadingObjects.map(o => o.url));

      // Filter out any URLs from the parent that are already being uploaded
      const newObjectsFromUrls = initialImageUrls
        .filter(url => !uploadingUrls.has(url))
        .map(url => ({ id: url, url, progress: 100 }));

      // Combine uploading objects with new/updated objects from parent
      return [...uploadingObjects, ...newObjectsFromUrls];
    });
  }, [initialImageUrls]);

  useEffect(() => {
    setImageObjects(currentObjects => 
      currentObjects.map(obj => 
        obj.file ? { ...obj, progress: overallProgress } : obj
      )
    );
  }, [overallProgress]);

  useEffect(() => {
    if (uploadedUrls.length > 0) {
      setImageObjects(currentObjects => {
        return currentObjects.map(obj => {
          const uploadedFile = uploadedUrls.find(u => u.fileName === obj.file?.name);
          if (uploadedFile) {
            return { ...obj, url: uploadedFile.url, id: uploadedFile.url, file: undefined, progress: 100 };
          }
          return obj;
        });
      });
    }
  }, [uploadedUrls]);

  const handleFileSelected = useCallback(async (files: File[]) => {
    const availableSlots = 12 - imageObjects.length;
    if (availableSlots <= 0) {
      toast.warning('Đã đạt giới hạn 12 hình ảnh.');
      return;
    }

    const filesToProcess = files.slice(0, availableSlots).filter(f => f.type.startsWith('image/'));
    if (filesToProcess.length === 0) return;

    const newImageObjects: ImageObject[] = filesToProcess.map(file => ({
      id: `uploading-${file.name}-${Date.now()}`,
      url: URL.createObjectURL(file),
      file: file,
      progress: 0,
    }));

    setImageObjects(prev => [...prev, ...newImageObjects]);
    
    await handleAddFiles(filesToProcess);

  }, [imageObjects.length, handleAddFiles]);

  const handleImageUpload = useCallback(() => fileInputRef.current?.click(), []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelected(Array.from(e.target.files));
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [handleFileSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFileSelected(Array.from(e.dataTransfer.files));
    }
  }, [handleFileSelected]);

  const handleRemoveSelected = useCallback(() => {
    if (selectedImageIds.length === 0) return;

    const uploadingFilesToRemove = imageObjects
      .filter(img => selectedImageIds.includes(img.id) && img.file)
      .map(img => img.file!);
    
    uploadingFilesToRemove.forEach(file => handleRemoveFile(file.name));

    setImageObjects(prev => prev.filter(img => !selectedImageIds.includes(img.id)));
    setSelectedImageIds([]);
  }, [imageObjects, selectedImageIds, handleRemoveFile]);

  const handleToggleSelect = useCallback((idToToggle: string) => {
    setSelectedImageIds(prev =>
      prev.includes(idToToggle)
        ? prev.filter(id => id !== idToToggle)
        : [...prev, idToToggle]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedImageIds.length === imageObjects.length) {
      setSelectedImageIds([]);
    } else {
      setSelectedImageIds(imageObjects.map(img => img.id));
    }
  }, [imageObjects, selectedImageIds.length]);

  const handleRemoveImage = useCallback(
    (id: string) => {
      const imageToRemove = imageObjects.find(img => img.id === id);
      
      // Remove from local UI state
      setImageObjects((prev) => prev.filter((img) => img.id !== id));

      // If it was an uploading file, call handleRemoveFile with its name
      if (imageToRemove && imageToRemove.file) {
        handleRemoveFile(imageToRemove.file.name);
      }
      // Note: For already uploaded files (not in the 'files' state of useUploadMedia anymore),
      // removing them from the UI is enough. If server-side deletion is needed, 
      // a separate mechanism would be required here.
    },
    [imageObjects, handleRemoveFile]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        setImageObjects((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    },
    [setImageObjects]
  );

  const handleDragEnter = useCallback(() => setIsDragOver(true), []);
  const handleDragLeave = useCallback(() => setIsDragOver(false), []);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);

  const imagesForDisplay = useMemo(() => imageObjects.map(img => img.url), [imageObjects]);

  return {
    images: imagesForDisplay, 
    imageObjects, 
    fileInputRef,
    handleImageUpload,
    handleFileChange,
    isDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    hoveredImageIndex,
    setHoveredImageIndex,
    selectedImages: selectedImageIds, 
    handleToggleSelect,
    handleSelectAll,
    handleRemoveSelected,
    handleDragEnd,
    isUploading,

  };
}