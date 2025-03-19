
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LightbulbIcon, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SuggestionForm from "@/components/suggestions/SuggestionForm";
import { useIsMobile } from "@/hooks/use-mobile";

type SuggestionHeaderProps = {
  user: any;
  setSuggestions: React.Dispatch<React.SetStateAction<any[]>>;
};

const SuggestionHeader = ({ user, setSuggestions }: SuggestionHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-12">
      <div className="text-left">
        <h1 className="text-2xl md:text-4xl font-bold font-dmsans">
          <span className="text-[#00FF00]">_</span>Propositions d'outils
        </h1>
        <p className="text-sm md:text-lg mt-2 text-gray-600 font-dmsans">
          Découvrez les outils les plus demandés par notre communauté et participez au vote ! 
          {!isMobile && " Nous développerons l'outil le plus voté (sans engagement sur les délais, notre développeur a une tendance à la procrastination)."}
        </p>
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-[#9b87f5] text-white font-medium hover:bg-[#8B5CF6] flex items-center gap-2 font-dmsans w-full md:w-auto mt-4 md:mt-0">
            <Plus size={isMobile ? 16 : 18} />
            Proposer un outil
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px] font-dmsans w-[95%] md:w-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-dmsans">
              <span className="text-[#00FF00]">_</span>Proposer un outil
            </DialogTitle>
            <DialogDescription className="font-dmsans text-sm md:text-base">
              Suggérez un outil qui pourrait être développé sur sydologie.ai
            </DialogDescription>
          </DialogHeader>
          <SuggestionForm 
            setSuggestions={setSuggestions} 
            user={user}
            navigate={navigate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuggestionHeader;
