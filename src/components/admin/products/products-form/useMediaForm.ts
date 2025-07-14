import { useState, useCallback, useRef } from 'react';

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

    return {
        fileInputRef,
        hoveredImageIndex,
        isDragOver,
        selectedImages,
        setHoveredImageIndex,
        handleImageUpload,
        handleFileChange,
        handleDragEnter,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleRemoveImage,
        handleToggleSelect,
        handleSelectAll,
        handleRemoveSelected,
    };
}