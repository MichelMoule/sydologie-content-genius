import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedTools from "@/components/FeaturedTools";
import Incontournables from "@/components/Incontournables";
import Actualites from "@/components/Actualites";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedTools />
      <Incontournables />
      <Actualites />
    </div>
  );
};

export default Index;