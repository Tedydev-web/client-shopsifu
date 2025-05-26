"use client";

import { useEffect, useState } from "react";
import { AuditLogsColumns, AuditLog } from "./auditLogs-Columns";
import SearchInput from "@/components/ui/data-table-component/search-input";
import { DataTable } from "@/components/ui/data-table-component/data-table";
import { Pagination } from "@/components/ui/data-table-component/pagination";
import { useAuditLogs } from "./useAuditLogs";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2 } from "lucide-react";
import { AuditLogsModalView } from "./auditLogs-ModalView";
import { AuditLogsStats } from "./aduitLogs-Stats";
import { useTranslation } from "react-i18next";

export function AuditLogsTable() {
  const { t } = useTranslation();
  const {
    auditLogs,
    totalItems,
    page,
    totalPages,
    loading,
    getAllAuditLogs,
  } = useAuditLogs();

  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [limit, setLimit] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const debouncedSearchValue = useDebounce(searchValue, 1000);

  useEffect(() => {
    getAllAuditLogs();
  }, []);

  useEffect(() => {
    if (debouncedSearchValue !== undefined) {
      setIsSearching(true);
      getAllAuditLogs({ page: 1, limit, search: debouncedSearchValue }).finally(() => setIsSearching(false));
    }
  }, [debouncedSearchValue, limit]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handlePageChange = (newPage: number) => {
    getAllAuditLogs({ page: newPage, limit });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    getAllAuditLogs({ page: 1, limit: newLimit }); // Reset về trang 1 khi thay đổi limit
  };

  // Xử lý click vào row để mở modal
  const handleRowClick = (row: any) => {
    setSelectedLog(row.original);
    setModalOpen(true);
  };

  return (
    <div className="w-full space-y-4">
      <AuditLogsStats />
      <div className="flex items-center gap-2">
        <SearchInput
          value={searchValue}
          onValueChange={handleSearch}
          placeholder={t("admin.auditLogs.searchPlaceholder")}
          className="max-w-sm"
        />
      </div>
      <div className="relative">
        {(loading || isSearching) && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <DataTable
          columns={AuditLogsColumns()}
          data={auditLogs}
          onRowClick={handleRowClick}
        />
      </div>
      {totalPages > 0 && (
        <Pagination
          limit={limit}
          page={page} // Đảm bảo page từ API
          totalPages={totalPages}
          totalRecords={totalItems}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
      <AuditLogsModalView
        open={modalOpen}
        onOpenChange={setModalOpen}
        data={selectedLog}
      />
    </div>
  );
}