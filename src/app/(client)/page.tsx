import { HeroSection } from "@/components/client/landing-page/hero-Section";
import { FlashSaleSection } from "@/components/client/landing-page/flashsale-Section";
import SuggestSection from "@/components/client/landing-page/suggest-Section";
import { CategoriesSection } from "@/components/client/landing-page/categories-Section";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <main className="flex flex-col min-h-screen">
      {/* <HeroSection /> */}
      <FlashSaleSection />
      <CategoriesSection />
      <SuggestSection />
      </main>

    </>
  );
}

