"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PaginationProps {
  limit: number;
  offset: number;
  totalPages: number;
  currentPage: number;
  totalRecords: number;
  onPageChange: (newOffset: number, newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

export function Pagination({
  limit,
  offset,
  totalPages,
  currentPage,
  totalRecords,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newOffset = offset - limit;
      onPageChange(newOffset, currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newOffset = offset + limit;
      onPageChange(newOffset, currentPage + 1);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    onLimitChange(newLimit);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 bg-[var(--pagination-button-bg)] border-gray-700 text-[var(--pagination-text-color)]"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          <ChevronLeft size={16} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 bg-[var(--pagination-button-bg)] border-blue-500 text-[var(--pagination-text-color)]"
        >
          {currentPage}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 bg-[var(--pagination-button-bg)] border-blue-500 text-[var(--pagination-text-color)]"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          <ChevronRight size={16} />
        </Button>
        <span className="text-gray-400 text-sm">
          Trang {currentPage} / {totalPages} (Tổng: {totalRecords} )
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Số mục trên mỗi trang:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-[var(--pagination-button-bg)] border-blue-500 text-[var(--pagination-text-color)]"
            >
              {limit}
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[var(--dropdown-bg)] border-gray-700">
            {[10, 25, 50].map((value) => (
              <DropdownMenuItem
                key={value}
                className="text-[var(--dropdown-text)] hcursor-pointer hover:bg-gray-700"
                onClick={() => handleLimitChange(value)}
              >
                {value}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
