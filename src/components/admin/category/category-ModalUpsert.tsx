"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./category-SortableItem";
import { ICategory } from "@/types/admin/category.interface";
import { Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { ChevronDown, ChevronRight } from "lucide-react";
// import { toast } from "sonner"; // Not used
import { mockCategoryData } from "./category-MockData";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  description: z.string().optional(),
  isActive: z.union([z.boolean(), z.string()]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

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
  useEffect(() => {
    if (mode === "edit" && category) form.reset({
      name: category.name, slug: category.slug, description: category.description || "", isActive: category.isActive,
      createdAt: category.createdAt ? new Date(category.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      updatedAt: category.updatedAt ? new Date(category.updatedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    });
    else form.reset({ name: "", slug: "", description: "", isActive: true, createdAt: new Date().toISOString().slice(0, 16), updatedAt: new Date().toISOString().slice(0, 16) });
  }, [category, mode, form]);
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
  // Thêm mới
  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
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
    await new Promise(r => setTimeout(r, 500));
    setIsLoading(false);
    form.reset({ name: "", slug: "", description: "", isActive: true, createdAt: new Date().toISOString().slice(0, 16), updatedAt: new Date().toISOString().slice(0, 16) });
    setSelectedParentId(null);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
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
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Định nghĩa DnDTree ở cuối file để tránh lỗi JSX và type
import React from "react";
interface DnDTreeProps {
  categories: ICategory[];
  setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
  categoryTree: any[];
  sensors: any;
  expanded: { [key: string]: boolean };
  toggleExpand: (id: string) => void;
}
const DnDTree: React.FC<DnDTreeProps> = ({ categories, setCategories, categoryTree, sensors, expanded, toggleExpand }) => {
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
    // Nếu cùng là con thì không cho phép
    if (draggedNode.parentId !== null && overNode.parentId !== null) {
      setDragOverId(String(over.id));
      setDragOverType(null);
      (window as any).__lastDragOverType = null;
      return;
    }
    const rect = overElement.getBoundingClientRect();
    let pointerY = rect.top + rect.height / 2;
    if (event?.delta?.y !== undefined && event?.active?.data?.current?.pointerPosition) pointerY = event.active.data.current.pointerPosition.y;
    else if (event?.delta?.y !== undefined) pointerY = rect.top + event.delta.y;
    const topZone = rect.top + rect.height * 0.25;
    const bottomZone = rect.bottom - rect.height * 0.25;

    // Nếu pointer nằm giữa (không ở top/bottom), hover làm con
    if (
      pointerY >= topZone && pointerY <= bottomZone &&
      draggedNode._id !== overNode._id &&
      overNode.parentId === null &&
      draggedNode.parentId === null
    ) {
      setDragOverId(String(over.id));
      setDragOverType('child');
      (window as any).__lastDragOverType = 'child';
      return;
    }

    // Nếu pointer ở trên hoặc dưới, đổi vị trí
    if (pointerY < topZone) {
      setDragOverId(String(over.id));
      setDragOverType('swap-top');
      (window as any).__lastDragOverType = 'swap-top';
      return;
    }
    if (pointerY > bottomZone) {
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
      setCategories((prev) => prev.map(i => i._id === active.id ? { ...i, parentId: null } : i));
      return;
    }
    setCategories((prev) => {
      const dragged = prev.find(i => i._id === active.id);
      const overNode = prev.find(i => i._id === over?.id);
      if (!dragged || !overNode) return prev;
      if (dragged.parentId === null && overNode.parentId === null && (dragOverType === 'swap-top' || dragOverType === 'swap-bottom') && dragged._id !== overNode._id) {
        const newCats = prev.map(i => i._id === active.id ? { ...i, sortOrder: overNode.sortOrder } : i._id === overNode._id ? { ...i, sortOrder: dragged.sortOrder } : i);
        return [...newCats].sort((a, b) => (a.sortOrder as number) - (b.sortOrder as number)).map((i, idx) => ({ ...i, lft: idx * 2 + 1, rgt: idx * 2 + 2 }));
      }
      if (dragOverType === 'child' && dragged._id !== overNode._id) return prev.map(i => i._id === active.id ? { ...i, parentId: overNode._id } : i);
      if (overNode.parentId === null && dragged.parentId !== null && overNode._id !== active.id && (dragOverType === 'swap-top' || dragOverType === 'swap-bottom')) {
        const newCats = prev.map(i => i._id === active.id ? { ...i, sortOrder: overNode.sortOrder, parentId: null } : i._id === overNode._id ? { ...i, sortOrder: dragged.sortOrder } : i);
        return [...newCats].sort((a, b) => (a.sortOrder as number) - (b.sortOrder as number)).map((i, idx) => ({ ...i, lft: idx * 2 + 1, rgt: idx * 2 + 2 }));
      }
      if (dragged.parentId !== null && overNode.parentId !== null && dragOverType === 'child') return prev;
      return prev.map(i => i._id === active.id ? { ...i, parentId: null } : i);
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
        <CategoryTreeAccordion tree={categoryTree} dragOverId={dragOverId} dragOverType={dragOverType} expanded={expanded} toggleExpand={toggleExpand} />
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
}
const CategoryTreeAccordion: React.FC<CategoryTreeAccordionProps> = ({ tree, dragOverId, dragOverType, expanded, toggleExpand }) => {
  // DroppableWrapper must be in scope
  const DroppableWrapper = ({ id, children }: { id: string, children: React.ReactNode }) => {
    const { setNodeRef } = useDroppable({ id });
    return <div ref={setNodeRef}>{children}</div>;
  };
  return (
    <ul className="space-y-0.5 bg-transparent">
      {tree.map((cat: any) => {
        const hasChildren = cat.children?.length > 0;
        const isOpen = expanded[cat._id] ?? true;
        return (
          <li key={cat._id} className="bg-transparent">
            <DroppableWrapper id={cat._id}>
              <div data-id={cat._id} className={`transition-all relative group flex items-center w-full ${dragOverId === cat._id && (dragOverType === 'swap-top' || dragOverType === 'swap-bottom') ? 'ring-2 ring-yellow-400' : ''} rounded-lg`}>
                <span className="w-5 inline-block">
                  {hasChildren ? (
                    <button type="button" onClick={() => toggleExpand(cat._id)} className="p-1 focus:outline-none">
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  ) : null}
                </span>
                <div className="flex-1 min-w-0">
                  <SortableItem item={{ ...cat, depth: 0 }} />
                </div>
              </div>
            </DroppableWrapper>
            {hasChildren && isOpen && (
              <ul className="ml-5 mt-0.5 space-y-0.5 bg-transparent">
                {cat.children.map((child: any) => (
                  <li key={child._id} className="bg-transparent">
                    <DroppableWrapper id={child._id}>
                      <div data-id={child._id} className="flex items-center w-full">
                        <div className="flex-1 min-w-0">
                          <SortableItem item={{ ...child, depth: 1 }} />
                        </div>
                      </div>
                    </DroppableWrapper>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};
