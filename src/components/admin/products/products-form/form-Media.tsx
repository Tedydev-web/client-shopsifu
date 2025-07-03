"use client";

import { useTranslations } from "next-intl";
import { UploadCloud } from "lucide-react";
import { Label } from "@/components/ui/label";

interface MediaFormProps {
    images: string[];
    setImages: (images: string[]) => void;
}

export const MediaForm = ({ images, setImages }: MediaFormProps) => {
    const t = useTranslations("admin.ModuleProduct.mainDetails.media");

    const handleImageUpload = () => {
        // Placeholder for actual upload logic.
        const newImages = [
            "https://via.placeholder.com/400x400/eeeeee/888888?text=Main",
            "https://via.placeholder.com/150x150/eeeeee/888888?text=Thumb+1",
            "https://via.placeholder.com/150x150/eeeeee/888888?text=Thumb+2",
            "https://via.placeholder.com/150x150/eeeeee/888888?text=Thumb+3",
        ];
        setImages(newImages);
    };

    return (
        <div className="grid gap-3">
            <Label>{t("title")}</Label>
            {images.length === 0 ? (
                <div
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={handleImageUpload}
                >
                    <UploadCloud className="w-10 h-10 text-gray-400" />
                    <p className="mt-4 font-semibold">{t("uploadTitle")}</p>
                    <p className="text-sm text-muted-foreground">{t("uploadSubtitle")}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2 row-span-2 rounded-lg overflow-hidden border-2 border-primary">
                        <img src={images[0]} alt="Main product" className="object-cover w-full h-full aspect-square" />
                    </div>
                    {images.slice(1, 4).map((img, index) => (
                        <div key={index} className="col-span-1 rounded-lg overflow-hidden border">
                            <img src={img} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full aspect-square" />
                        </div>
                    ))}
                    <div
                        className="col-span-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary transition-colors aspect-square"
                        onClick={handleImageUpload}
                    >
                        <p className="text-sm font-medium">{t("uploadMore")}</p>
                    </div>
                </div>
            )}
        </div>
    );
};