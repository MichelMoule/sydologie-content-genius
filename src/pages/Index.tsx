import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedTools from "@/components/FeaturedTools";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedTools />
    </div>
  );
};

export default Index;