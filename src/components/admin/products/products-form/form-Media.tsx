"use client";

import { UploadCloud, X, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMediaForm } from "./useMediaForm";
import { Checkbox } from "@/components/ui/checkbox";

interface MediaFormProps {
    images: string[];
    setImages: (images: string[]) => void;
}

export const MediaForm = ({ images, setImages }: MediaFormProps) => {
    const [showAllImages, setShowAllImages] = useState(false);
    const {
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
        handleToggleSelect,
        handleSelectAll,
        handleRemoveSelected,
    } = useMediaForm({ images, setImages });

    const handleShowMoreImages = () => setShowAllImages(true);

    const isSelectionMode = selectedImages.length > 0;
    const allSelected = selectedImages.length === images.length;

    return (
        <div className="grid gap-3">
            <div className="flex justify-between items-center">
                {!isSelectionMode ? (
                    <Label>Hình ảnh sản phẩm</Label>
                ) : (
                    <div className="flex items-center gap-3 w-full">
                        <Checkbox
                            id="select-all-images"
                            checked={allSelected}
                            onCheckedChange={handleSelectAll}
                            aria-label="Chọn tất cả ảnh"
                        />
                        <Label htmlFor="select-all-images" className="text-sm font-medium cursor-pointer">
                            Đã chọn {selectedImages.length} / {images.length}
                        </Label>
                        <Button 
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={handleRemoveSelected}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa mục đã chọn
                        </Button>
                    </div>
                )}
            </div>
            
            {/* Input ẩn để chọn file */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                multiple 
                className="hidden"
                title="Chọn hình ảnh sản phẩm"
                aria-label="Chọn hình ảnh sản phẩm"
            />
            
            {images.length === 0 ? (
                <div
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragOver 
                            ? 'border-primary bg-primary/10' 
                            : 'border-gray-300 hover:border-primary'
                    }`}
                    onClick={handleImageUpload}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <UploadCloud className={`w-8 h-8 ${isDragOver ? 'text-primary' : 'text-gray-400'}`} />
                    <p className="mt-3 font-semibold text-sm">
                        {isDragOver ? 'Thả file vào đây' : 'Tải lên hình ảnh sản phẩm'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {isDragOver ? 'Thả để tải lên' : 'Kéo thả hoặc chọn file từ máy tính'}
                    </p>
                </div>
            ) : (
                <div 
                    className="space-y-3 relative"
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className={`grid grid-cols-5 grid-rows-2 gap-3 transition-opacity ${isDragOver ? 'opacity-50' : ''}`}>
                        {/* Ảnh chính */}
                                                {/* Ảnh chính */}
                        <div 
                            className={`col-span-2 row-span-2 relative rounded-lg overflow-hidden border transition-all duration-200`}
                            onMouseEnter={() => setHoveredImageIndex(0)}
                            onMouseLeave={() => setHoveredImageIndex(null)}
                        >
                            <Image
                                src={images[0]}
                                alt="Ảnh chính sản phẩm"
                                className="object-contain w-full h-full aspect-square"
                                width={500}
                                height={500}
                            />
                            <div className={`absolute inset-0 bg-slate-900/20 transition-opacity duration-200 ${hoveredImageIndex === 0 || selectedImages.includes(0) ? 'opacity-100' : 'opacity-0'}`}></div>
                            {(hoveredImageIndex === 0 || selectedImages.includes(0)) && (
                                <Checkbox
                                    checked={selectedImages.includes(0)}
                                    onCheckedChange={() => handleToggleSelect(0)}
                                    className="absolute top-2 left-2 bg-white/80 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                    aria-label="Chọn ảnh chính"
                                />
                            )}
                        </div>
                        
                        {(() => {
                          const hasMoreImages = images.length > 5;
                          const canAddMore = images.length < 12;

                          return (
                            <>
                              {/* Render all other images */}
                              {images.slice(1, showAllImages ? 12 : 5).map((img, index) => {
                                const actualIndex = index + 1;
                                return (
                                  <div
                                    key={actualIndex}
                                    className={`relative rounded-lg overflow-hidden border aspect-square h-full w-full transition-all duration-200`}
                                    onMouseEnter={() => setHoveredImageIndex(actualIndex)}
                                    onMouseLeave={() => setHoveredImageIndex(null)}
                                  >
                                    <Image
                                      src={img}
                                      alt={`Ảnh phụ ${actualIndex}`}
                                      className="object-contain w-full h-full"
                                      width={250}
                                      height={250}
                                    />
                                    <div className={`absolute inset-0 bg-slate-900/20 transition-opacity duration-200 ${hoveredImageIndex === actualIndex || selectedImages.includes(actualIndex) ? 'opacity-100' : 'opacity-0'}`}></div>
                                    {(hoveredImageIndex === actualIndex || selectedImages.includes(actualIndex)) && (
                                        <Checkbox
                                            checked={selectedImages.includes(actualIndex)}
                                            onCheckedChange={() => handleToggleSelect(actualIndex)}
                                            className="absolute top-2 left-2 bg-white/80 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                            aria-label={`Chọn ảnh ${actualIndex}`}
                                        />
                                    )}
                                  </div>
                                )
                              })}

                              {/* "Show More" button placeholder */}
                              {!showAllImages && hasMoreImages && (
                                <div
                                  onClick={() => setShowAllImages(true)}
                                  className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary transition-colors aspect-square h-full w-full"
                                >
                                  <span className="text-sm font-medium">+{images.length - 5}</span>
                                </div>
                              )}

                              {/* Add image button */}
                              {canAddMore && (
                                <div
                                  onClick={handleImageUpload}
                                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary transition-colors aspect-square h-full w-full"
                                >
                                  <UploadCloud className="w-5 h-5 text-gray-400" />
                                  <p className="text-xs font-medium mt-1">Thêm ảnh</p>
                                </div>
                              )}

                              {/* Hide button */}
                              {showAllImages && (
                                <div className="col-span-5 flex justify-end">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setShowAllImages(false)}
                                  >
                                    Ẩn
                                  </Button>
                                </div>
                              )}
                            </>
                          )
                        })()}
                    </div>
                    
                    {/* Drag overlay khi đang kéo file */}
                    {isDragOver && (
                        <div className="absolute inset-0 bg-primary/5 border-2 border-primary border-dashed rounded-lg flex items-center justify-center z-10 pointer-events-none">
                            <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-4 border shadow-lg">
                                <UploadCloud className="w-12 h-12 text-primary mx-auto mb-2" />
                                <p className="text-primary font-semibold">Thả file vào đây để tải lên</p>
                                <p className="text-sm text-muted-foreground">Hỗ trợ nhiều file ảnh</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};