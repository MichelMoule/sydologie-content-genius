
import Navbar from "@/components/Navbar";
import ToolsHero from "@/components/tools/ToolsHero";
import ToolSection from "@/components/tools/ToolSection";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";
import { useLanguage } from "@/hooks/use-language";

const Outils = () => {
  const { t } = useLanguage();
  
  return <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <ToolsHero />

      {/* Tools Sections */}
      <div className="container mx-auto px-4 pb-16">
        {/* Conception Tools */}
        <ToolSection title={t("tools.sections.conception")} tools={tools.conception} />

        {/* Analysis Tools */}
        <ToolSection title={t("tools.sections.analysis")} tools={tools.analyse} />
      </div>
      
      <Footer />
    </div>;
};
export default Outils;
