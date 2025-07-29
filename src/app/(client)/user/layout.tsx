"use client";

import { useResponsive } from "@/hooks/useResponsive";
import { Sidebar } from "@/components/client/user/layout/user-Sidebar";
import MobileHeader from "@/components/client/user/account/moblie/moblie-Header";
import { UserMobileHeaderProvider } from "@/providers/UserMobileHeaderContext";
import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";
import { useUserData } from "@/hooks/useGetData-UserLogin";
import ProfileHeader from "@/components/client/user/account/profile/profile-Header";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile } = useResponsive();
  const userData = useUserData();

  return (
    <UserMobileHeaderProvider>
      <ClientLayoutWrapper hideHeader hideCommit hideHero hideFooter>
        <div className="!w-full !max-w-none !px-0 !mx-0 !bg-neutral-200">
          {isMobile ? (
            <div className="fixed inset-0 z-50 bg-background">
              <MobileHeader />
              <main className="px-4 h-[calc(100vh-72px)] overflow-y-auto">
                <div className="max-w-4xl mx-auto w-full">
                  {/* Profile Header mobile */}
                  <ProfileHeader
                    name={userData?.name || ""}
                    email={userData?.email || ""}
                    phone={userData?.phoneNumber || ""}
                    // birthday={userData?.dob || ""}
                    avatar={userData?.avatar || ""}
                    totalOrders={userData?.statistics?.totalOrders || 0}
                    totalSpent={userData?.statistics?.totalSpent || 0}
                    memberSince={userData?.statistics.memberSince}
                  />
                  {children}
                </div>
              </main>
            </div>
          ) : (
            <div className="flex flex-col min-h-[90vh] bg-[#f5f5f7] text-foreground">
              {/* ✅ Profile header full width */}
              <div className="px-6 pt-6">
                <div className="w-full lg:max-w-[1280px] xl:max-w-[1440px] mx-auto">
                  <ProfileHeader
                    name={userData?.name || ""}
                    email={userData?.email || ""}
                    phone={userData?.phoneNumber || ""}
                    // birthday={userData?.dob || ""}
                    avatar={userData?.avatar || ""}
                    totalOrders={userData?.statistics?.totalOrders || 0}
                    totalSpent={userData?.statistics?.totalSpent || 0}
                    memberSince={userData?.statistics.memberSince}
                  />
                </div>
              </div>

              {/* Sidebar + children */}
              <div className="flex flex-1 gap-4 px-6 pb-6">
                <aside className="w-[340px] min-w-[280px] pt-6">
                  <Sidebar />
                </aside>
                <main className="flex-1 overflow-hidden pt-6">
                  <div className="w-full lg:max-w-[1280px] xl:max-w-[1440px] mx-auto space-y-6">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          )}
        </div>
      </ClientLayoutWrapper>
    </UserMobileHeaderProvider>
  );
}
