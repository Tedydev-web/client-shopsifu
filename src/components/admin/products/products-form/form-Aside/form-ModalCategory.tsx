'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Category } from '@/types/admin/category.interface';
import { categoryService } from '@/services/admin/categoryService';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (categoryId: number | null) => void;
}

export function CategoryModal({ open, onOpenChange, onConfirm }: CategoryModalProps) {
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(false);

  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  const fetchParentCategories = useCallback(async () => {
    setLoadingParents(true);
    try {
      const params = { page: 1, limit: 100 };
      const response = await categoryService.getAll(params);
      setParentCategories(response.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh mục cha');
    } finally {
      setLoadingParents(false);
    }
  }, []);

  const fetchChildCategories = useCallback(async (parentId: number) => {
    setLoadingChildren(true);
    setChildCategories([]);
    try {
      const params = { page: 1, limit: 100, parentCategoryId: parentId.toString() };
      const response = await categoryService.getAll(params);
      setChildCategories(response.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh mục con');
    } finally {
      setLoadingChildren(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchParentCategories();
    }
  }, [open, fetchParentCategories]);

  const handleParentSelect = (parent: Category) => {
    setSelectedParent(parent);
    setSelectedChildId(null);
    if (parent.id) {
      fetchChildCategories(parent.id);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedChildId || selectedParent?.id || null);
    onOpenChange(false);
  };

  const selectionPath = useMemo(() => {
    if (!selectedParent) return '';
    const child = childCategories.find((c) => c.id === selectedChildId);
    return child ? `${selectedParent.name} > ${child.name}` : selectedParent.name;
  }, [selectedParent, selectedChildId, childCategories]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-none w-[60vw] max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chọn danh mục sản phẩm</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-4 border-t border-b" style={{ height: '400px', minWidth: '800px' }}>

          {/* Parent Category Column */}
          <ScrollArea className="col-span-1 border-r">
            <div className="p-2">
              {loadingParents ? (
                <p className="p-2 text-sm text-muted-foreground">Đang tải...</p>
              ) : (
                parentCategories.map((parent) => (
                  <button
                    key={parent.id}
                    onClick={() => handleParentSelect(parent)}
                    className={cn(
                      'w-full text-left p-2 rounded-md flex justify-between items-center text-sm',
                      selectedParent?.id === parent.id ? 'text-primary font-semibold' : 'hover:bg-muted/50'
                    )}
                  >
                    {parent.name}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Child Category Column */}
          <ScrollArea className="col-span-1 border-r">
            <div className="p-2">
              {loadingChildren ? (
                <p className="p-2 text-sm text-muted-foreground">Đang tải...</p>
              ) : (
                childCategories.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={cn(
                      'w-full text-left p-2 rounded-md text-sm',
                      selectedChildId === child.id ? 'text-primary font-semibold' : 'hover:bg-muted/50'
                    )}
                  >
                    {child.name}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>

          {/* 3rd Column (Empty) */}
          <ScrollArea className="col-span-1 border-r"></ScrollArea>

          {/* 4th Column (Empty) */}
          <ScrollArea className="col-span-1"></ScrollArea>
        </div>

        <DialogFooter className="sm:justify-between">
            <div className="text-sm text-muted-foreground">
                Đã chọn: <span className='text-foreground font-medium'>{selectionPath}</span>
            </div>
            <div className='flex gap-2'>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Hủy</Button>
                </DialogClose>
                <Button type="button" onClick={handleConfirm} disabled={!selectionPath}>Xác nhận</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
