import { useState, useCallback, useRef, useMemo } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

interface UseMediaFormProps {
    images: string[];
    setImages: (images: string[]) => void;
}

export function useMediaForm({ images, setImages }: UseMediaFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);
    const [selectedImages, setSelectedImages] = useState<number[]>([]);
    const [showAllImages, setShowAllImages] = useState(false);

    const handleImageUpload = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const availableSlots = 12 - images.length;
        if (availableSlots <= 0) return; // Đã đạt giới hạn

        const filesToProcess = Array.from(files).slice(0, availableSlots);
        const newImageUrls = filesToProcess
            .filter(file => file.type.startsWith('image/'))
            .map(file => URL.createObjectURL(file));

        if (newImageUrls.length > 0) {
            setImages([...images, ...newImageUrls]);
        }
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [images, setImages]);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => prev + 1);
        if (dragCounter === 0) {
            setIsDragOver(true);
        }
    }, [dragCounter]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'copy';
        }
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => {
            const newCounter = prev - 1;
            if (newCounter === 0) {
                setIsDragOver(false);
            }
            return newCounter;
        });
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        setDragCounter(0);

        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        const availableSlots = 12 - images.length;
        if (availableSlots <= 0) return; // Đã đạt giới hạn

        const filesToProcess = Array.from(files).slice(0, availableSlots);
        const newImageUrls = filesToProcess
            .filter(file => file.type.startsWith('image/'))
            .map(file => URL.createObjectURL(file));

        if (newImageUrls.length > 0) {
            setImages([...images, ...newImageUrls]);
        }
    }, [images, setImages]);

    const handleRemoveImage = useCallback((indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
        setSelectedImages([]); // Clear selection after removing an image
    }, [images, setImages]);

    const handleToggleSelect = useCallback((indexToToggle: number) => {
        setSelectedImages(prevSelected => 
            prevSelected.includes(indexToToggle)
                ? prevSelected.filter(index => index !== indexToToggle)
                : [...prevSelected, indexToToggle]
        );
    }, []);

    const handleSelectAll = useCallback(() => {
        if (selectedImages.length === images.length) {
            setSelectedImages([]); // Deselect all
        } else {
            setSelectedImages(images.map((_, index) => index)); // Select all
        }
    }, [images, selectedImages.length]);

    const handleRemoveSelected = useCallback(() => {
        if (selectedImages.length === 0) return;
        setImages(images.filter((_, index) => !selectedImages.includes(index)));
        setSelectedImages([]);
    }, [images, selectedImages, setImages]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = images.findIndex(img => img === active.id);
            const newIndex = images.findIndex(img => img === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newImages = arrayMove(images, oldIndex, newIndex);
                setImages(newImages);
            }
        }
    }, [images, setImages]);

    return {
        images,
        setImages,
        fileInputRef,
        handleImageUpload,
        handleFileChange,
        isDragOver,
        dragCounter,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleRemoveImage,
        hoveredImageIndex,
        setHoveredImageIndex,
        selectedImages,
        handleToggleSelect,
        handleSelectAll,
        handleRemoveSelected,
        showAllImages,
        setShowAllImages,
        handleDragEnd
    };
}