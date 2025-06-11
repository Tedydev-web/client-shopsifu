"use client";

import { useCheckDevice } from "@/hooks/useCheckDevices";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileDesktop = dynamic(() => import("./desktop/profile-DesktopIndex"), {
  loading: () => <Skeleton className="w-full h-full" />,
  ssr: false,
});
const ProfileMobile = dynamic(() => import("./mobile/profile-MobileIndex"), {
  loading: () => <Skeleton className="w-full h-full" />,
  ssr: false,
});

export function ProfileMain() {
  const deviceType = useCheckDevice();
  const isMobileView = deviceType === "mobile";

  return (
    <div className="w-full h-full">
      {isMobileView ? <ProfileMobile /> : <ProfileDesktop />}
    </div>
  );
}