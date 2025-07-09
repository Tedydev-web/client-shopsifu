"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ICategory } from "@/types/admin/category.interface";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { Loader2, ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { mockCategoryData } from "./category-MockData";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  description: z.string().optional(),
  isActive: z.union([z.boolean(), z.string()]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Helper function for getting parent node
const getParentNode = (nodeId: string, categories: ICategory[]): ICategory | null => {
  const node = categories.find(cat => cat._id === nodeId);
  if (!node?.parentId) return null;
  return categories.find(cat => cat._id === node.parentId) || null;
};

type CategoryFormValues = z.infer<typeof formSchema>;



interface CategoryModalUpsertProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  category?: ICategory;
  // onSave: (data: any) => void; // To be implemented
  // onDelete: (id: string) => void; // To be implemented
}

export function CategoryModalUpsert({
  isOpen,
  onClose,
  mode,
  category,
}: CategoryModalUpsertProps) {
  return (
    <CategoryModalUpsertContent 
      isOpen={isOpen}
      onClose={onClose}
      mode={mode}
      category={category}
    />
  );
}


// Tối ưu: gom các state, hàm, component nhỏ vào 1 chỗ, rút gọn logic, giữ lại ý nghĩa và comment tiếng Việt.
function CategoryModalUpsertContent({ isOpen, onClose, mode, category }: CategoryModalUpsertProps) {
  // State & i18n
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  
  // Reset form khi đóng modal hoặc chuyển mode
  const resetFormAndState = () => {
    form.reset({ 
      name: "", 
      slug: "", 
      description: "", 
      isActive: true, 
      createdAt: new Date().toISOString().slice(0, 16), 
      updatedAt: new Date().toISOString().slice(0, 16) 
    });
    setSelectedParentId(null);
    setSelectedCategory(null);
  };
  // Chuyển mockCategoryData dạng tree sang mảng phẳng, gán parentId đúng
  const buildInitialCategories = () => {
    const flat: ICategory[] = [];
    let idx = 0;
    const walk = (node: any, parentId: string | null) => {
      flat.push({
        _id: node.id,
        name: node.name,
        slug: node.name.toLowerCase().replace(/\s+/g, '-'),
        description: node.description || '',
        parentId,
        lft: idx * 2 + 1,
        rgt: idx * 2 + 2,
        sortOrder: idx,
        isActive: node.isActive,
        createdAt: new Date(node.createdAt),
        updatedAt: new Date(node.updatedAt),
      });
      idx++;
      if (Array.isArray(node.children)) {
        node.children.forEach((child: any) => walk(child, node.id));
      }
    };
    mockCategoryData.forEach((cat: any) => walk(cat, null));
    return flat;
  };
  const [categories, setCategories] = useState<ICategory[]>(buildInitialCategories());

  // Reset lại dữ liệu mẫu mỗi khi mở modal
  useEffect(() => {
    if (isOpen) {
      setCategories(buildInitialCategories());
    }
  }, [isOpen]);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  // Đóng dropdown khi click ngoài
  useEffect(() => {
    if (!showStatusDropdown) return;
    const handler = (e: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) setShowStatusDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showStatusDropdown]);
  // Form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", slug: "", description: "", isActive: true, createdAt: new Date().toISOString().slice(0, 16), updatedAt: new Date().toISOString().slice(0, 16) },
  });
  // State for selected category (instead of window.__selectedCategory)
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  // Khi chọn danh mục nào thì form sẽ hiển thị nội dung danh mục đó để chỉnh sửa
  useEffect(() => {
    if (selectedCategory) {
      form.reset({
        name: selectedCategory.name,
        slug: selectedCategory.slug,
        description: selectedCategory.description || "",
        isActive: selectedCategory.isActive,
        createdAt: selectedCategory.createdAt ? new Date(selectedCategory.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        updatedAt: selectedCategory.updatedAt ? new Date(selectedCategory.updatedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      });
      setSelectedParentId(selectedCategory.parentId || null);
    } else if (mode === "edit" && category) {
      form.reset({
        name: category.name, slug: category.slug, description: category.description || "", isActive: category.isActive,
        createdAt: category.createdAt ? new Date(category.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        updatedAt: category.updatedAt ? new Date(category.updatedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      });
      setSelectedParentId(category.parentId || null);
    } else {
      form.reset({ name: "", slug: "", description: "", isActive: true, createdAt: new Date().toISOString().slice(0, 16), updatedAt: new Date().toISOString().slice(0, 16) });
      setSelectedParentId(null);
    }
  }, [selectedCategory, category, mode, form]);
  // DnD
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 }, movementAxis: 'y' }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  // Xây cây cha-con từ mảng phẳng, hỗ trợ nhiều cấp nếu cần
  const buildTree = (items: ICategory[]) => {
    const map: Record<string, any> = {};
    const roots: any[] = [];
    items.forEach(item => {
      map[item._id] = { ...item, children: [] };
    });
    items.forEach(item => {
      if (item.parentId && map[item.parentId]) {
        map[item.parentId].children.push(map[item._id]);
      } else {
        roots.push(map[item._id]);
      }
    });
    // Sắp xếp children theo lft
    const sortTree = (nodes: any[]) => {
      nodes.sort((a, b) => a.lft - b.lft);
      nodes.forEach(n => n.children && sortTree(n.children));
    };
    sortTree(roots);
    return roots;
  };
  const categoryTree = buildTree(categories);
  // Thêm mới hoặc cập nhật
  // Đảm bảo selectedCategory/setSelectedCategory luôn được khai báo phía trên
  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    if (selectedCategory) {
      // Cập nhật danh mục đang chọn
      setCategories(prev => prev.map(cat =>
        cat._id === selectedCategory._id
          ? {
              ...cat,
              name: data.name,
              slug: data.slug,
              description: data.description,
              isActive: data.isActive === true || data.isActive === 'true',
              updatedAt: new Date(),
              parentId: selectedParentId || null,
            }
          : cat
      ));
      setSelectedCategory(null);
    } else {
      // Thêm mới
      setCategories(prev => [...prev, {
        _id: `cat_${Date.now()}`,
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: selectedParentId || null,
        lft: prev.length * 2 + 1,
        rgt: prev.length * 2 + 2,
        sortOrder: prev.length,
        isActive: data.isActive === true || data.isActive === 'true',
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);
    }
    await new Promise(r => setTimeout(r, 500));
    setIsLoading(false);
    form.reset({ name: "", slug: "", description: "", isActive: true, createdAt: new Date().toISOString().slice(0, 16), updatedAt: new Date().toISOString().slice(0, 16) });
    setSelectedParentId(null);
    setSelectedCategory(null);
  };
  // Xóa
  const handleDelete = async () => {
    if (!category) return;
    setIsDeleting(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsDeleting(false);
    onClose();
  };
  // Wrapper droppable
  const DroppableWrapper = ({ id, children }: { id: string, children: React.ReactNode }) => {
    const { setNodeRef } = useDroppable({ id });
    return <div ref={setNodeRef}>{children}</div>;
  };
  // Drag & drop logic tối giản
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    // @ts-ignore
    const dragOverType = event?.dragOverType || window.__lastDragOverType;
    if (!over || active.id === over.id) {
      setCategories(prev => prev.map(i => i._id === active.id ? { ...i, parentId: null } : i));
      return;
    }
    setCategories(prev => {
      const dragged = prev.find(i => i._id === active.id);
      const overNode = prev.find(i => i._id === over?.id);
      if (!dragged || !overNode) return prev;
      // swap cha
      if (dragged.parentId === null && overNode.parentId === null && (dragOverType === 'swap-top' || dragOverType === 'swap-bottom') && dragged._id !== overNode._id) {
        const newCats = prev.map(i => i._id === active.id ? { ...i, sortOrder: overNode.sortOrder } : i._id === overNode._id ? { ...i, sortOrder: dragged.sortOrder } : i);
        return [...newCats].sort((a, b) => a.sortOrder - b.sortOrder).map((i, idx) => ({ ...i, lft: idx * 2 + 1, rgt: idx * 2 + 2 }));
      }
      // thành con
      if (dragOverType === 'child' && dragged._id !== overNode._id) return prev.map(i => i._id === active.id ? { ...i, parentId: overNode._id } : i);
      // swap con lên cha
      if (overNode.parentId === null && dragged.parentId !== null && overNode._id !== active.id && (dragOverType === 'swap-top' || dragOverType === 'swap-bottom')) {
        const newCats = prev.map(i => i._id === active.id ? { ...i, sortOrder: overNode.sortOrder, parentId: null } : i._id === overNode._id ? { ...i, sortOrder: dragged.sortOrder } : i);
        return [...newCats].sort((a, b) => a.sortOrder - b.sortOrder).map((i, idx) => ({ ...i, lft: idx * 2 + 1, rgt: idx * 2 + 2 }));
      }
      // không cho phép con thành con của con
      if (dragged.parentId !== null && overNode.parentId !== null && dragOverType === 'child') return prev;
      // kéo vào node con hoặc chính nó: thành cha
      return prev.map(i => i._id === active.id ? { ...i, parentId: null } : i);
    });
  }
  // Accordion tree có expand/collapse
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const toggleExpand = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  // Tiêu đề
  const title = mode === "add" ? t("admin.pages.category.addTitle") : t("admin.pages.category.editTitle");
  const description = mode === "add"
    ? "Tạo mới một danh mục sản phẩm. Có thể kéo thả để sắp xếp hoặc phân cấp."
    : t("admin.pages.category.editDescription");

  // Render chia 2 phần 40-60
  return (
    <Dialog open={isOpen} onOpenChange={() => {
      resetFormAndState();
      onClose();
    }}>
      <DialogContent
        data-mode={mode}
        className="w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 p-8 overflow-y-auto"
        style={{ width: '90vw', height: '90vh', maxWidth: '90vw', maxHeight: '90vh' }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold mb-1">{title}</DialogTitle>
          <DialogDescription className="text-sm md:text-base mb-4">{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-6 w-full min-h-[320px] h-full">
          {/* Bên trái: Form tạo/cập nhật danh mục (40%) */}
          <div className="w-[40%] min-w-[260px] max-w-[480px] border-r border-gray-100 pr-6 flex flex-col justify-start bg-gray-50 rounded-l-2xl shadow-md py-8 px-6 h-full overflow-y-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.pages.category.name')}</FormLabel>
                        <FormControl>
                          <Input className="h-9" placeholder={t('admin.pages.category.namePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.pages.category.slug')}</FormLabel>
                        <FormControl>
                          <Input className="h-9" placeholder={t('admin.pages.category.slugPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('admin.pages.category.description')}</FormLabel>
                      <FormControl>
                        <Textarea rows={2} className="resize-none" placeholder={t('admin.pages.category.descriptionPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('admin.pages.category.status')}</FormLabel>
                      <FormControl>
                        <Select value={field.value === true || field.value === 'true' ? 'true' : 'false'} onValueChange={field.onChange}>
                          <SelectTrigger className="h-9 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">{t('admin.pages.category.statusActive')}</SelectItem>
                            <SelectItem value="false">{t('admin.pages.category.statusInactive')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2 pt-2">
                  <Button type="submit" disabled={isLoading} className="w-28">
                    {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                    {mode === "add" ? "Thêm mới" : "Cập nhật"}
                  </Button>
                  {mode === "edit" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive" disabled={isDeleting} className="w-20">
                          {isDeleting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                          Xóa
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                          <AlertDialogDescription>Bạn có chắc chắn muốn xóa danh mục này?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </form>
            </Form>
          </div>
          {/* Bên phải: Danh sách danh mục (60%) */}
          <div className="w-[60%] min-w-[300px] flex flex-col justify-start pl-6">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-lg text-gray-800">Danh sách danh mục</div>
            </div>
            <div className="flex-1 overflow-auto min-h-[300px] bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
              <DnDTree
                categories={categories}
                setCategories={setCategories}
                categoryTree={categoryTree}
                sensors={sensors}
                expanded={expanded}
                toggleExpand={toggleExpand}
                onSelectCategory={(cat: ICategory) => setSelectedCategory(cat)}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// SortableItem component for DnD functionality
interface SortableItemProps {
  item: ICategory & { depth: number };
}

const SortableItem: React.FC<SortableItemProps> = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item._id, data: { item } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${item.depth * 24}px`, // Add indentation based on tree depth
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex-1"
    >
      <div className="flex items-center p-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
        <div className="w-12 flex justify-center">
          <button {...listeners} className="cursor-grab active:cursor-grabbing p-1">
            <GripVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="w-12 flex justify-center">
          {/* Placeholder for expand button - will be positioned here by parent component */}
        </div>
        <div className="flex-1 pl-2 min-w-0">
          <span className="truncate">{item.name}</span>
        </div>
      </div>
    </div>
  );
};

// Định nghĩa DnDTree ở cuối file để tránh lỗi JSX và type
import React from "react";
interface DnDTreeProps {
  categories: ICategory[];
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
  categoryTree: any[];
  sensors: any;
  expanded: { [key: string]: boolean };
  toggleExpand: (id: string) => void;
  onSelectCategory: (cat: ICategory) => void;
  selectedCategory: ICategory | null;
}
const DnDTree: React.FC<DnDTreeProps> = ({ categories, setCategories, categoryTree, sensors, expanded, toggleExpand, onSelectCategory, selectedCategory }) => {
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);
  const [dragOverType, setDragOverType] = React.useState<'swap-top' | 'swap-bottom' | 'child' | null>(null);
  function handleDragOver(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setDragOverId(null);
      setDragOverType(null);
      (window as any).__lastDragOverType = null;
      return;
    }

    const overElement = document.querySelector(`[data-id='${over.id}']`);
    if (!overElement) {
      setDragOverId(null);
      setDragOverType(null);
      (window as any).__lastDragOverType = null;
      return;
    }

    const draggedId = event.active.id;
    const draggedNode = categories.find((i) => i._id === draggedId);
    const overNode = categories.find((i) => i._id === over.id);
    
    if (!draggedNode || !overNode) {
      setDragOverId(null);
      setDragOverType(null);
      (window as any).__lastDragOverType = null;
      return;
    }

    // Kiểm tra các quy tắc kéo thả
    const targetId = over.id;
    const canMoveToChild = canBecomeChild(draggedId.toString(), targetId.toString(), categories);
    
    // Quy tắc:
    // 1. Không cho phép thả vào node con
    // 2. Chỉ cho phép trở thành con nếu thỏa mãn điều kiện canBecomeChild
    // 3. Cho phép hoán đổi vị trí giữa các node cùng cấp
    // 4. Cho phép kéo node cha từ dưới lên để trở thành con
    
    const rect = overElement.getBoundingClientRect();
    let pointerY = event?.active?.data?.current?.pointerPosition?.y ?? rect.top + rect.height / 2;
    
    const topZone = rect.top + rect.height * 0.25;
    const bottomZone = rect.bottom - rect.height * 0.25;

    // Logic xử lý khi kéo thả:
    
    // 1. Kiểm tra trường hợp kéo vào khu vực chứa con (khi pointer ở giữa)
    if (pointerY >= topZone && pointerY <= bottomZone) {
      // Cho phép kéo thả vào bất kỳ node nào, canBecomeChild sẽ xử lý logic thực tế
      if (draggedNode._id !== overNode._id &&
          canBecomeChild(draggedNode._id.toString(), overNode._id.toString(), categories)) {
        setDragOverId(String(over.id));
        setDragOverType('child');
        (window as any).__lastDragOverType = 'child';
        return;
      }
    }

    // 2. Kiểm tra hoán đổi vị trí
    // Node cùng cấp là:
    // - Cả hai đều là node cha, hoặc
    // - Cả hai đều là node con của cùng một cha
    const sameLevel = (draggedNode.parentId === null && overNode.parentId === null) ||
                     (draggedNode.parentId === overNode.parentId);
    
    // Nếu pointer ở trên và cùng cấp
    if (pointerY < topZone && sameLevel) {
      setDragOverId(String(over.id));
      setDragOverType('swap-top');
      (window as any).__lastDragOverType = 'swap-top';
      return;
    }

    // Nếu pointer ở dưới và cùng cấp
    if (pointerY > bottomZone && sameLevel) {
      setDragOverId(String(over.id));
      setDragOverType('swap-bottom');
      (window as any).__lastDragOverType = 'swap-bottom';
      return;
    }

    // Mặc định không hover
    setDragOverId(null);
    setDragOverType(null);
    (window as any).__lastDragOverType = null;
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    // @ts-ignore
    const dragOverType = event?.dragOverType || window.__lastDragOverType;
    if (!over || active.id === over.id) {
      // Reset any dropped item to be a parent if dropped outside
      setCategories((prev) => prev.map(i => i._id === active.id ? { ...i, parentId: null } : i));
      return;
    }
    
    setCategories((prev) => {
      const dragged = prev.find(i => i._id === active.id);
      const overNode = prev.find(i => i._id === over?.id);
      if (!dragged || !overNode) return prev;

      // Case 1: Hoán đổi vị trí hoặc chuyển sang cha mới
      if (dragOverType === 'swap-top' || dragOverType === 'swap-bottom') {
        const bothParents = dragged.parentId === null && overNode.parentId === null;
        const sameParent = dragged.parentId !== null && dragged.parentId === overNode.parentId;
        
        // Nếu kéo node con vào node cha khác -> trở thành con của cha mới
        if (dragged.parentId !== null && overNode.parentId === null) {
          return prev.map(i => 
            i._id === active.id ? { ...i, parentId: overNode._id } : i
          );
        }
        
        // Nếu cả hai là cha hoặc cùng một cha -> hoán đổi vị trí
        if (bothParents || sameParent) {
          const newCats = prev.map(i => {
            if (i._id === active.id) {
              return { ...i, sortOrder: overNode.sortOrder };
            }
            if (i._id === overNode._id) {
              return { ...i, sortOrder: dragged.sortOrder };
            }
            return i;
          });
          
          return [...newCats]
            .sort((a, b) => (a.sortOrder as number) - (b.sortOrder as number))
            .map((i, idx) => ({ ...i, lft: idx * 2 + 1, rgt: idx * 2 + 2 }));
        }
      }

      // Case 2: Making a node a child of another
      if (dragOverType === 'child') {
        // Lấy parentId của node đích nếu nó là con, ngược lại dùng node đích làm cha
        const newParentId = overNode.parentId || overNode._id;
        
        // Kiểm tra một lần nữa để đảm bảo an toàn
        if (canBecomeChild(active.id.toString(), over.id.toString(), prev)) {
          return prev.map(i => 
            i._id === active.id ? { ...i, parentId: newParentId } : i
          );
        }
      }

      // If no valid operation was found, reset the dragged node to be a parent
      return prev.map(i => 
        i._id === active.id ? { ...i, parentId: null } : i
      );
    });
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={categories.map((cat) => cat._id)}
        strategy={verticalListSortingStrategy}
      >
        <CategoryTreeAccordion
          tree={categoryTree}
          dragOverId={dragOverId}
          dragOverType={dragOverType}
          expanded={expanded}
          toggleExpand={toggleExpand}
          onSelectCategory={onSelectCategory}
          selectedCategory={selectedCategory}
        />
      </SortableContext>
    </DndContext>
  );
};

// Accordion tree component moved to shared scope
interface CategoryTreeAccordionProps {
  tree: any[];
  dragOverId?: string | null;
  dragOverType?: 'swap-top' | 'swap-bottom' | 'child' | null;
  expanded: { [key: string]: boolean };
  toggleExpand: (id: string) => void;
  onSelectCategory: (cat: ICategory) => void;
  selectedCategory: ICategory | null;
}
const CategoryTreeAccordion: React.FC<CategoryTreeAccordionProps> = ({ tree, dragOverId, dragOverType, expanded, toggleExpand, onSelectCategory, selectedCategory }) => {
  // DroppableWrapper must be in scope
  const DroppableWrapper = ({ id, children }: { id: string, children: React.ReactNode }) => {
    const { setNodeRef } = useDroppable({ id });
    return <div ref={setNodeRef}>{children}</div>;
  };

  // Lấy mode từ props gần nhất
  const mode = document.querySelector('[data-mode]')?.getAttribute('data-mode') || 'add';
  const isEditMode = mode === 'edit';

  return (
    <ul className="space-y-0.5 bg-transparent">
      {tree.map((cat: any) => {
        const hasChildren = cat.children?.length > 0;
        const isOpen = expanded[cat._id] ?? true;
        const isSelected = selectedCategory && selectedCategory._id === cat._id;
        return (
          <li key={cat._id} className="bg-transparent">
            <DroppableWrapper id={cat._id}>
              <div
                data-id={cat._id}
                className={`transition-all relative group flex items-center w-full 
                  ${dragOverId === cat._id && (dragOverType === 'swap-top' || dragOverType === 'swap-bottom') ? 'ring-2 ring-yellow-400' : ''} 
                  ${isSelected ? 'bg-red-300' : ''} 
                  ${isEditMode ? 'cursor-pointer' : 'cursor-default'} 
                  rounded-lg`}
                onClick={() => isEditMode && onSelectCategory(cat)}
              >
                <div className="flex-1 relative">
                    <SortableItem item={{ ...cat, depth: 0 }} />
                  {hasChildren ? (
                    <div className="absolute left-[48px] top-1/2 -translate-y-1/2 z-10">
                      <button type="button" onClick={e => { e.stopPropagation(); toggleExpand(cat._id); }} className="p-1 focus:outline-none">
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </DroppableWrapper>
            {hasChildren && isOpen && (
              <ul className="ml-5 mt-0.5 space-y-0.5 bg-transparent">
                {cat.children.map((child: any) => {
                  const isChildSelected = selectedCategory && selectedCategory._id === child._id;
                  return (
                    <li key={child._id} className="bg-transparent">
                      <DroppableWrapper id={child._id}>
                        <div
                          data-id={child._id}
                          className={`flex items-center w-full 
                            ${isChildSelected ? 'bg-red-100' : ''} 
                            ${isEditMode ? 'cursor-pointer' : 'cursor-default'} 
                            rounded-lg`}
                          onClick={() => isEditMode && onSelectCategory(child)}
                        >
                          <div className="flex-1">
                            <SortableItem item={{ ...child, depth: 1 }} />
                          </div>
                        </div>
                      </DroppableWrapper>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

// Helper functions to check parent-child relationships
function hasChildren(categoryId: string, categories: ICategory[]): boolean {
  return categories.some(cat => cat.parentId === categoryId);
}

function isChild(categoryId: string, categories: ICategory[]): boolean {
  return categories.some(cat => cat._id === categoryId && cat.parentId !== null);
}

function canBecomeChild(draggedId: string, targetId: string, categories: ICategory[]): boolean {
  const draggedItem = categories.find(c => c._id === draggedId);
  const targetItem = categories.find(c => c._id === targetId);
  
  if (!draggedItem || !targetItem) return false;
  
  // Rules for parent-child relationships:
  // 1. Cannot drag to self
  // 2. Target cannot be a descendant of dragged node
  // 3. Dragged node must not have children
  // 4. If target is a child, use its parent as the actual target
  // 5. Cannot create circular references
  
  // Nếu target là con, lấy parentId của nó làm target mới
  const actualTargetId = targetItem.parentId || targetId;
  const actualTarget = categories.find(c => c._id === actualTargetId);
  
  if (!actualTarget) return false;
  
  return draggedId !== targetId &&
         draggedId !== actualTargetId &&
         !hasChildren(draggedId, categories) &&
         !isAncestor(draggedId, actualTargetId, categories);
}

// Hàm kiểm tra xem một node có phải là con cháu của node khác không
function isAncestor(ancestorId: string, descendantId: string, categories: ICategory[]): boolean {
  const descendant = categories.find(cat => cat._id === descendantId);
  if (!descendant || !descendant.parentId) return false;
  
  if (descendant.parentId === ancestorId) return true;
  
  return isAncestor(ancestorId, descendant.parentId, categories);
}
