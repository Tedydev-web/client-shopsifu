import { HeroSection } from "@/components/client/landing-page/hero-Section";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection className="mt-4" />
      
      {/* Categories Section - Will be implemented later */}
      {/* 
      <section className="py-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          Category content will go here
        </div>
      </section> 
      */}
      
      {/* Additional sections will go here */}
    </main>
  );
}

