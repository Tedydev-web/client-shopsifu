import { SearchInput } from "@/components/ui/data-table-component/search-input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function ApproveOrdersHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
      <SearchInput placeholder="Tìm mã đơn hàng, tên KH..." />
      <Button variant="outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        Tải lại
      </Button>
    </div>
  );
}
