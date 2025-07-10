"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from "@/types/admin/category.interface";

// Define props interface
interface CategoryModalUpsertProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  category?: Category | null;
  onSubmit: (data: CategoryCreateRequest | CategoryUpdateRequest) => Promise<any>;
}

export function CategoryModalUpsert({
  isOpen,
  onClose,
  mode,
  category,
  onSubmit,
}: CategoryModalUpsertProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Define form schema with Zod
  const formSchema = z.object({
    name: z.string().min(1, t("validation.required", { field: t("admin.pages.category.column.name") })),
    parentCategoryId: z.union([z.number().nullable(), z.string().nullable()]),
    logo: z.string().nullable().optional(),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      parentCategoryId: null,
      logo: null,
    }
  });

  // Update form values when category changes (edit mode)
  useEffect(() => {
    if (mode === 'edit' && category) {
      form.reset({
        name: category.name || "",
        parentCategoryId: category.parentCategoryId,
        logo: category.logo,
      });
    } else {
      form.reset({
        name: "",
        parentCategoryId: null,
        logo: null,
      });
    }
  }, [category, mode, form]);

  // Handle form submission
  const handleSubmitForm = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      // Convert parentCategoryId from string to number if needed
      const processedData = {
        ...data,
        parentCategoryId: data.parentCategoryId ? Number(data.parentCategoryId) : null,
      };
      
      await onSubmit(processedData);
      onClose();
    } catch (error) {
      console.error("Error submitting category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add'
              ? t("admin.pages.category.addCategory")
              : t("admin.pages.category.editCategory")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.pages.category.column.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("admin.pages.category.namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.pages.category.column.parentCategory")}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder={t("admin.pages.category.parentPlaceholder")}
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : null;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("admin.pages.category.parentHelp")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.pages.category.column.logo")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t("admin.pages.category.logoPlaceholder")}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("admin.pages.category.logoHelp")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'add' ? t("common.create") : t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
