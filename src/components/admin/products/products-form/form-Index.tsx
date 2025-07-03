"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/component/rich-text-editor";
import { MediaForm } from "./form-Media"; // Import the MediaForm component

export function ProductForm() {
  const t = useTranslations("admin.ModuleProduct");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]); // State for images

  return (
    <form className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      {/* Left Column */}
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
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
      </div>

      {/* Right Column */}
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
         <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center h-full">
            <p className="text-muted-foreground">{t("asidePlaceholder")}</p>
        </div>
      </div>
    </form>
  );
}