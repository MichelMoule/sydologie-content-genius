

import Navbar from "@/components/Navbar";
import ToolsHero from "@/components/tools/ToolsHero";
import ToolSection from "@/components/tools/ToolSection";
import Footer from "@/components/Footer";
import { tools, getToolsByCategory } from "@/data/tools";

const Outils = () => {
  // Filter out 'formations' and 'suggestions' from all tools
  const filteredAllTools = tools.filter(tool => 
    tool.id !== 'formations' && tool.id !== 'suggestions'
  );

  // Get filtered featured and non-featured tools
  const featuredTools = filteredAllTools.filter(tool => tool.featured);
  const otherTools = filteredAllTools.filter(tool => !tool.featured);

  // Define the tool image mapping
  const toolImages: Record<string, string> = {
    feedbaick: "/lovable-uploads/fab8b6f4-ee19-4af1-ac6b-dcb3a25f63dc.png",
    flashcards: "/lovable-uploads/daac4fa8-e8b3-46d2-85f0-05683cee2086.png",
    glossaire: "/lovable-uploads/0fcb8597-72f0-49af-9bd2-164bec0bd00f.png",
    program: "/lovable-uploads/eaa23ea4-5041-4325-a593-cb4c12634115.png",
    quiz: "/lovable-uploads/bf183287-4043-4239-b9e6-56552a0ff26b.png",
    videoscript: "/lovable-uploads/99315df8-42be-48a5-8197-0f97735a8cec.png",
    "prompt-engineer": "/lovable-uploads/d65fc816-3265-46b8-8cc5-9df7b7aff414.png",
    diapoai: "/lovable-uploads/e09e2047-10f7-447a-b3c7-fb3b5a726fec.png",
    schemai: "/lovable-uploads/1b3e812b-a858-42cb-b3d4-6c437e7e8db2.png",
    // Utiliser une image par défaut pour les outils qui n'ont pas d'image spécifique
    default: "/placeholder.svg"
  };

  // Define partner logos for tools that have them
  const partnerLogos: Record<string, string> = {
    diapoai: "/lovable-uploads/add91aaa-29b6-4d20-b3d2-ce7dd35edc3b.png"
  };

  // Map the tools to the format expected by ToolSection
  const mapToolsToToolSection = (toolsList) => {
    return toolsList.map(tool => ({
      id: Number(tool.id),
      name: tool.name,
      description: tool.description,
      image: toolImages[tool.id] || toolImages.default,
      path: tool.link,
      partnerLogo: partnerLogos[tool.id] || null
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
        {otherTools.length > 0 && (
          <ToolSection title="Nos autres outils" tools={mapToolsToToolSection(otherTools)} />
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Outils;

