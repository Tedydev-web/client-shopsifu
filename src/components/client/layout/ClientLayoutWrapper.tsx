"use client";

import { ScrollLock } from "@/components/client/layout/ScrollLock";
import { Footer } from "@/components/client/layout/footer/Footer"
import HeroSectionWrapper from "@/components/client/landing-page/wrapper/hero-Wrapper";
import HeaderWrapper from "@/components/client/layout/header/header-Wrapper";
import DesktopCommit from "@/components/client/layout/header/desktop/desktop-Commit";
import { useCheckDevice } from "@/hooks/useCheckDevices";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideCommit?: boolean;
  hideHero?: boolean;
  hideFooter?: boolean;
  topContent?: React.ReactNode;
}

export default function ClientLayoutWrapper({
  children,
  hideHeader = false,
  hideCommit = false,
  hideHero = false,
  hideFooter = false,
  topContent,
}: ClientLayoutWrapperProps) {
  const deviceType = useCheckDevice();

  return (
    <div className="min-h-screen w-full flex flex-col">
      <ScrollLock />
      {!hideHeader && (
        <>
          <HeaderWrapper />
        </>
      )}
      {!hideCommit && (
        <>
        <DesktopCommit />
        </>
      )}
      {topContent && <div className="w-full">{topContent}</div>}
      <main className="flex-grow bg-[#F5F5FA]">
        {!hideHero && <HeroSectionWrapper />}
        <div
          className={`max-w-[1250px] w-full mx-auto ${
            deviceType !== "mobile" ? "px-4 sm:px-6" : ""
          }`}
        >
          {children}
        </div>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
