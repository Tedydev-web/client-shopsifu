"use client";

import { useCheckDevice } from "@/hooks/useCheckDevices";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const SearchDesktopIndex = dynamic(() => import("@/components/client/search/desktop/search-Index"), {
  loading: () => <Skeleton className="w-full h-full" />,
  ssr: false,
});
const SearchMobileIndex = dynamic(() => import("@/components/client/search/mobile/search-IndexMobile"), {
  loading: () => <Skeleton className="w-full h-full" />,
  ssr: false,
});

export function SearchContent() {
  const deviceType = useCheckDevice();
  const isMobileView = deviceType === "mobile";

  return (
    <div className="w-full h-full">
      {isMobileView ? <SearchMobileIndex /> : <SearchDesktopIndex />}
    </div>
  );
}