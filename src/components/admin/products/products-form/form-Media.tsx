"use client";

import { UploadCloud, X, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface MediaFormProps {
    images: string[];
    setImages: (images: string[]) => void;
}

export const MediaForm = ({ images, setImages }: MediaFormProps) => {
    // const t = useTranslations("admin.ModuleProduct.mainDetails.media");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showAllImages, setShowAllImages] = useState(false);
    const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);

    // Xử lý việc tải lên ảnh từ máy tính
    const handleImageUpload = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, []);

    // Xử lý khi người dùng chọn file
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newImages: string[] = [...images];

        // Chuyển đổi từng file thành URL để hiển thị
        Array.from(files).forEach(file => {
            const imageUrl = URL.createObjectURL(file);
            newImages.push(imageUrl);
        });

        setImages(newImages);
        
        // Reset input để có thể chọn lại cùng một file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [images, setImages]);

    // Xử lý xóa ảnh
    const handleRemoveImage = useCallback((indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
        setShowAllImages(false);
    }, [images, setImages]);
    
    // Xử lý khi click vào ô hiển thị số ảnh còn lại
    const handleShowMoreImages = useCallback(() => {
        setShowAllImages(true);
    }, []);

    return (
        <div className="grid gap-3">
            <Label>Hình ảnh sản phẩm</Label>
            
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
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={handleImageUpload}
                >
                    <UploadCloud className="w-8 h-8 text-gray-400" />
                    <p className="mt-3 font-semibold text-sm">Tải lên hình ảnh sản phẩm</p>
                    <p className="text-xs text-muted-foreground">Kéo thả hoặc chọn file từ máy tính</p>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleImageUpload();
                        }}
                    >
                        Chọn file
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="grid grid-cols-5 grid-rows-2 gap-3">
                        {/* Ảnh chính */}
                        <div 
                            className="col-span-2 row-span-2 relative rounded-lg overflow-hidden border"
                            onMouseEnter={() => setHoveredImageIndex(0)}
                            onMouseLeave={() => setHoveredImageIndex(null)}
                        >
                            <Image
                                src={images[0]}
                                alt="Ảnh chính sản phẩm"
                                className="object-contain w-full h-full aspect-square"
                                width={500}
                                height={500}
                                objectFit="contain"
                            />
                            {hoveredImageIndex === 0 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(0)}
                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                                    title="Xóa ảnh chính"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        
                        {(() => {
                          const canAddMore = images.length < 10
                          const extraImages = images.slice(5)
                          const showSeeMore = !showAllImages && extraImages.length > 0
                          const displayedImages = showAllImages
                            ? images.slice(1) // hiển thị toàn bộ ảnh phụ khi showAllImages
                            : images.slice(1, 5) // chỉ 4 ảnh phụ đầu nếu chưa show all

                          return (
                            <>
                              {/* Ảnh phụ hiện tại (1 → 4 hoặc toàn bộ nếu showAllImages) */}
                              {displayedImages.map((img, index) => {
                                const actualIndex = index + 1
                                return (
                                  <div
                                    key={actualIndex}
                                    className="relative rounded-lg overflow-hidden border aspect-square h-full w-full"
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
                                    {hoveredImageIndex === actualIndex && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveImage(actualIndex)}
                                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                                        title={`Xóa ảnh ${actualIndex}`}
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                )
                              })}

                              {/* Nếu chưa show all → hiển thị nút xem thêm */}
                              {showSeeMore && (
                                <div
                                  onClick={handleShowMoreImages}
                                  className="flex flex-col items-center justify-center border rounded-lg text-center cursor-pointer hover:border-primary transition-colors aspect-square h-full w-full bg-gray-50"
                                >
                                  <div className="font-semibold text-lg">+{extraImages.length}</div>
                                  <p className="text-xs text-gray-500">Xem thêm</p>
                                </div>
                              )}

                              {/* Nếu đã show full và ảnh còn lại > 0 → hiển thị các ảnh còn lại thay thế cho xem thêm + thêm ảnh */}
                              {showAllImages &&
                                extraImages.map((img, index) => {
                                  const actualIndex = index + 5
                                  return (
                                    <div
                                      key={actualIndex}
                                      className="relative rounded-lg overflow-hidden border aspect-square h-full w-full"
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
                                      {hoveredImageIndex === actualIndex && (
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveImage(actualIndex)}
                                          className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                                          title={`Xóa ảnh ${actualIndex}`}
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  )
                                })}

                              {/* Ô thêm ảnh chỉ khi tổng số ảnh < 10 */}
                              {canAddMore && (
                                <div
                                  onClick={handleImageUpload}
                                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary transition-colors aspect-square h-full w-full"
                                >
                                  <UploadCloud className="w-5 h-5 text-gray-400" />
                                  <p className="text-xs font-medium mt-1">Thêm ảnh</p>
                                </div>
                              )}

                              {/* Nút Ẩn nếu đã mở toàn bộ */}
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
                </div>
            )}
        </div>
    );
};