"use client";

import { useResponsive } from "@/hooks/useResponsive";
import { Sidebar } from "@/components/client/user/layout/user-Sidebar";
import MobileHeader from "@/components/client/user/account/moblie/moblie-Header";
import { UserMobileHeaderProvider } from "@/providers/UserMobileHeaderContext";
import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile } = useResponsive();

  return (
    <UserMobileHeaderProvider>
      <ClientLayoutWrapper hideHeader hideCommit hideHero hideFooter>
        {/* Bọc lớp để override layout tổng */}
        <div className="!w-full !max-w-none !px-0 !mx-0 !bg-neutral-200">
          {isMobile ? (
            <div className="fixed inset-0 z-50 bg-background">
              <MobileHeader />
              <main className="px-4 h-[calc(100vh-72px)] overflow-y-auto">
                <div className="max-w-4xl mx-auto w-full">{children}</div>
              </main>
            </div>
          ) : (
            <div className="flex h-[90vh] bg-[#f5f5f7] text-foreground gap-4 py-6">
              <aside className="w-[340px] min-w-[280px] pt-6">
                <Sidebar />
              </aside>
              <main className="flex-1 overflow-hidden pt-6">
                <div className="w-full max-w-full lg:max-w-[1280px] xl:max-w-[1440px] mx-auto space-y-6">
                  {children}
                </div>
              </main>
            </div>
          )}
        </div>
      </ClientLayoutWrapper>
    </UserMobileHeaderProvider>
  );
}
