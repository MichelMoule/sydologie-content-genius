
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedTools from "@/components/FeaturedTools";
import Incontournables from "@/components/Incontournables";
import Newsletter from "@/components/Newsletter";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#EDE8E0] font-dmsans">
      <Navbar />
      <Hero />
      <FeaturedTools />
      <Incontournables />
      <Newsletter />
    </div>
  );
};

export default Index;
