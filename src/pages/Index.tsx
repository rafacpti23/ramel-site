
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProductsSection from "@/components/ProductsSection";
import PromotionSection from "@/components/PromotionSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SecurityBadges from "@/components/SecurityBadges";
import ProductBanner from "@/components/ProductBanner";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background" style={{
      backgroundImage: "url('/images/bg-pattern.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed"
    }}>
      <Navbar />
      <main className="flex-1 pt-20">
        <HeroSection />
        
        {/* Product Banner with Transition */}
        <ProductBanner />
        
        <ServicesSection />
        <ProductsSection 
          deliveryLogoUrl="https://i.ibb.co/qgRmCS7/3.png" 
        />
        <SecurityBadges />
        <PromotionSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
