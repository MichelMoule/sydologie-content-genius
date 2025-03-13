
import Navbar from "@/components/Navbar";
import ToolsHero from "@/components/tools/ToolsHero";
import ToolSection from "@/components/tools/ToolSection";
import { tools } from "@/data/tools";

const Outils = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <ToolsHero />

      {/* Tools Sections */}
      <div className="container mx-auto px-4 py-16">
        {/* Conception Tools */}
        <ToolSection title="Nos outils de conception" tools={tools.conception} />

        {/* Realisation Tools */}
        <ToolSection title="Nos outils pour la réalisation" tools={tools.realisation} />

        {/* Analysis Tools */}
        <ToolSection title="Nos outils d'analyse" tools={tools.analyse} />
      </div>
    </div>
  );
};

export default Outils;
