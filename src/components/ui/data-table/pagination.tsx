"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

export function Pagination({
  limit,
  page,
  totalPages,
  totalRecords,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const { t } = useTranslation();

  const handlePreviousPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    onLimitChange(newLimit);
    onPageChange(1); // Reset về trang 1 khi thay đổi limit
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm">{t('admin.pagination.results')}:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-gray-300 shadow-sm"
            >
              {limit}
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[80px] border-gray-200 shadow-lg">
            {[10, 25, 50].map((value) => (
              <DropdownMenuItem
                key={value}
                className={`cursor-pointer ${limit === value ? "bg-gray-100 font-semibold" : ""}`}
                onClick={() => handleLimitChange(value)}
              >
                {value}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2 text-gray-700 text-sm">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 border-gray-300"
          disabled={page === 1}
          onClick={handlePreviousPage}
        >
          <ChevronLeft size={16} />
        </Button>
        <span className="px-2 font-semibold text-base select-none">
          {page}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 border-gray-300"
          disabled={page === totalPages}
          onClick={handleNextPage}
        >
          <ChevronRight size={16} />
        </Button>
        <span className="ml-2 text-gray-400 text-sm">
          {t('admin.pagination.page', 'Trang')} {page} / {totalPages} | {t('admin.pagination.total', 'Tổng')}: {totalRecords}
        </span>
      </div>
    </div>
  );
}