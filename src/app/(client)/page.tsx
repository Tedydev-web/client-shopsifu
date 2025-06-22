import { CategoriesSection } from "@/components/client/landing-page/categories-Section";
import FlashSaleSectionWrapper from "@/components/client/landing-page/wrapper/flashsale-Wrapper";
import SuggestSectionWrapper from "@/components/client/landing-page/wrapper/suggest-Wrapper";

export default function HomePage() {
  return (
    <>
      <main className="flex flex-col min-h-screen">
      <CategoriesSection />
      <FlashSaleSectionWrapper />
      <SuggestSectionWrapper />
      </main>

    </>
  );
}

