
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
    // Use specific image assets for tools that should have them
    return toolsList.map(tool => {
      // Map of tool IDs to their respective image paths
      const toolImages = {
        'program': "/lovable-uploads/11f4232d-1b7a-4f8d-b618-46ab72d881b5.png",
        'glossaire': "/lovable-uploads/b293fc5f-d161-41c4-8889-8e2e574d9238.png",
        'flashcards': "/lovable-uploads/323c4fdf-2153-4ef0-9c92-5ea24ab4bade.png",
        'feedbaick': "/lovable-uploads/54f5902a-b223-49d6-99d1-66627d855a79.png",
        'diapoai': "/lovable-uploads/716e18bb-8160-42f9-8fb7-ec0f88d754ae.png",
        'prompt-engineer': "/lovable-uploads/6888803e-0376-421b-8d1f-8f62e0e2ed38.png"
      };

      const image = toolImages[tool.id] || `/placeholder.svg`;
      
      return {
        id: tool.id,
        name: tool.name,
        description: tool.description,
        image: image,
        path: tool.link
      };
    });
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
