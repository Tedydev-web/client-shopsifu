"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { ICategory } from '@/types/admin/category.interface';

interface SortableItemProps {
  item: ICategory & { depth: number };
}

export function SortableItem({ item }: SortableItemProps) {
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
      className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
    >
      <span>{item.name}</span>
      <button {...listeners} className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
}
