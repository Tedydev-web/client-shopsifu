"use client";

import { useResponsive } from "@/hooks/useResponsive";
import { Sidebar } from "@/components/client/user/layout/user-Sidebar";
import MobileHeader from "@/components/client/user/account/moblie/moblie-Header";
import { UserMobileHeaderProvider } from "@/contexts/UserMobileHeaderContext";
import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile } = useResponsive();

  return (
    <UserMobileHeaderProvider>
      {isMobile ? (
        <ClientLayoutWrapper hideHeader hideCommit hideHero hideFooter>
          <div className="fixed inset-0 z-50 bg-background">
            <MobileHeader />
            <main className="px-4 h-[calc(100vh-72px)] overflow-y-auto">
              <div className="max-w-4xl mx-auto w-full">{children}</div>
            </main>
          </div>
        </ClientLayoutWrapper>
      ) : (
        <ClientLayoutWrapper hideHeader hideCommit hideHero hideFooter>
          <div className="flex h-[90vh] bg-[#f5f5f7] text-foreground gap-6 px-6 py-6">
            <aside className="w-[280px] min-w-[280px] pt-6">
              <Sidebar />
            </aside>

            <main className="flex-1 overflow-hidden pt-6">
              <div className="w-full max-w-[1100px] mx-auto space-y-6">
                {children}
              </div>
            </main>
          </div>
        </ClientLayoutWrapper>
      )}
    </UserMobileHeaderProvider>
  );
}
