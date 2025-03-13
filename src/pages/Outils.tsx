
import Navbar from "@/components/Navbar";
import ToolsHero from "@/components/tools/ToolsHero";
import ToolSection from "@/components/tools/ToolSection";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";
import { FileText } from "lucide-react";

const Outils = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <ToolsHero />

      {/* AI Summary Section */}
      <div className="container mx-auto px-4 mb-16 bg-gray-50 p-8 rounded-lg">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-[#1F5E40]/10 rounded-full">
            <FileText className="h-6 w-6 text-[#1F5E40]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 font-dmsans">
              <span className="text-[#1F5E40]">_</span>Résumé AI des outils disponibles
            </h2>
            <p className="text-gray-700 mb-4 font-dmsans">
              Nous proposons une suite d'outils alimentés par l'intelligence artificielle pour faciliter la création, la réalisation et l'analyse de vos formations pédagogiques.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4 font-dmsans">
              <li>Des outils de <strong>conception</strong> pour créer rapidement des programmes, quiz, scripts vidéo et flashcards</li>
              <li>Des outils de <strong>réalisation</strong> pour générer des résumés et des glossaires techniques</li>
              <li>Des outils d'<strong>analyse</strong> pour comprendre les retours de vos apprenants</li>
            </ul>
            <p className="text-gray-700 mt-4 font-dmsans">
              Tous nos outils sont conçus pour vous faire gagner du temps et améliorer la qualité de vos formations grâce à la puissance de l'IA.
            </p>
          </div>
        </div>
      </div>

      {/* Tools Sections */}
      <div className="container mx-auto px-4 pb-16">
        {/* Conception Tools */}
        <ToolSection title="Nos outils de conception" tools={tools.conception} />

        {/* Realisation Tools */}
        <ToolSection title="Nos outils pour la réalisation" tools={tools.realisation} />

        {/* Analysis Tools */}
        <ToolSection title="Nos outils d'analyse" tools={tools.analyse} />
      </div>
      
      <Footer />
    </div>
  );
};

export default Outils;
