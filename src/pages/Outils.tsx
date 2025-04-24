import Navbar from "@/components/Navbar";
import ToolsHero from "@/components/tools/ToolsHero";
import ToolSection from "@/components/tools/ToolSection";
import Footer from "@/components/Footer";
import { tools, getToolsByCategory } from "@/data/tools";

const Outils = () => {
  // Get all tools and split them into featured and non-featured ones
  const allTools = getToolsByCategory("all");
  const featuredTools = allTools.filter(tool => tool.featured);
  const otherTools = allTools.filter(tool => !tool.featured);

  // Map the tools to the format expected by ToolSection
  const mapToolsToToolSection = (toolsList) => {
    return toolsList.map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      image: tool.icon, // Use icon property as image
      path: tool.link
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <ToolsHero />

      {/* Tools Sections */}
      <div className="container mx-auto px-4 pb-16">
        {/* Featured Tools */}
        <ToolSection title="Nos outils de conception" tools={mapToolsToToolSection(featuredTools)} />

        {/* Other Tools */}
        <ToolSection title="Nos autres outils" tools={mapToolsToToolSection(otherTools)} />
      </div>
      
      <Footer />
    </div>
  );
};

export default Outils;
