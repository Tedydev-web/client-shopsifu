"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/component/rich-text-editor";
import { MediaForm } from "./form-Media"; // Import the MediaForm component
import AsideForm from "./form-Aside"; // Import the AsideForm component
import { VariantSettingsForm } from "./form-Variant-Settings/form-VariantSettings"; // Import the VariantSettingsForm component

export function ProductForm() {
  const t = useTranslations("admin.ModuleProduct");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]); // State for images
  const [originalPrice, setOriginalPrice] = useState(""); // Giá gốc
  const [salePrice, setSalePrice] = useState(""); // Giá ảo

  // Format number to VND currency format (without VND text)
  const formatCurrency = (value: string): string => {
    const number = value.replace(/[^\d]/g, '');
    if (!number) return '';
    return new Intl.NumberFormat('vi-VN').format(parseInt(number));
  };

  // Handle price input change
  const handlePriceChange = (value: string, setPriceState: (value: string) => void) => {
    const numericValue = value.replace(/[^\d]/g, '');
    setPriceState(numericValue);
  };

  return (
    <form className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
      {/* Left Column - Main Content */}
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 xl:col-span-3">
        <Card>
          <CardContent className="grid gap-6 mt-4">
            <div className="grid gap-3">
              <Label htmlFor="product-title">{t("mainDetails.productTitle")}</Label>
              <Input
                id="product-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("mainDetails.productTitlePlaceholder")}
                className="w-full"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-content">{t("mainDetails.content")}</Label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
            <MediaForm images={images} setImages={setImages} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="original-price">Giá gốc</Label>
                <Input
                  id="original-price"
                  type="text"
                  value={formatCurrency(originalPrice)}
                  onChange={(e) => handlePriceChange(e.target.value, setOriginalPrice)}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="sale-price">Giá ảo</Label>
                <Input
                  id="sale-price"
                  type="text"
                  value={formatCurrency(salePrice)}
                  onChange={(e) => handlePriceChange(e.target.value, setSalePrice)}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <VariantSettingsForm />
      </div>

      {/* Right Column - Sidebar */}
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1 xl:col-span-1">
        <AsideForm />
      </div>
    </form>
  );
}