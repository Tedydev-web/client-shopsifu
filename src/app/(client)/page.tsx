import { HeroSection } from "@/components/client/landing-page/hero-Section";
import { FlashSaleSection } from "@/components/client/landing-page/flashsale-Section";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <main className="flex flex-col min-h-screen">
      {/* <HeroSection /> */}
      <FlashSaleSection />
      </main>
    </>
  );
}

