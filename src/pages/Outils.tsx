
import Navbar from "@/components/Navbar";
import ToolsHero from "@/components/tools/ToolsHero";
import ToolSection from "@/components/tools/ToolSection";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";

const Outils = () => {
  return <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <ToolsHero />

      {/* Tools Sections */}
      <div className="container mx-auto px-4 pb-16">
        {/* Conception Tools */}
        <ToolSection title="Nos outils de conception" tools={tools.conception} />

        {/* Analysis Tools */}
        <ToolSection title="Nos outils d'analyse" tools={tools.analyse} />
      </div>
      
      <Footer />
    </div>;
};
export default Outils;
