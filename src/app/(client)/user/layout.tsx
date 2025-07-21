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
        <ClientLayoutWrapper hideHeader hideCommit hideHero hideFooter={false}>
          <div className="flex min-h-screen bg-[#f5f5f7] text-foreground">
            <aside className="w-[260px] h-screen sticky top-0 bg-[#f5f5f7] border-gray-200 pt-6">
              <Sidebar />
            </aside>

            <main className="flex-1 p-6 overflow-hidden">
              <div className="w-full max-w-[1100px] mx-auto">{children}</div>
            </main>
          </div>
        </ClientLayoutWrapper>
      )}
    </UserMobileHeaderProvider>
  );
}
