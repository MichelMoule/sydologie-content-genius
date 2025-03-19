
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
import { useLanguage } from "@/hooks/use-language";

type SuggestionHeaderProps = {
  user: any;
  setSuggestions: React.Dispatch<React.SetStateAction<any[]>>;
};

const SuggestionHeader = ({ user, setSuggestions }: SuggestionHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-12">
      <div className="text-left">
        <h1 className="text-2xl md:text-4xl font-bold font-dmsans">
          <span className="text-[#00FF00]">_</span>{t("suggestions.pageTitle")}
        </h1>
        <p className="text-sm md:text-lg mt-2 text-gray-600 font-dmsans">
          {t("suggestions.pageDescription")}
          {!isMobile && " " + t("suggestions.pageDescriptionExtended")}
        </p>
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-sydologie-green text-white font-medium hover:bg-sydologie-green/90 flex items-center gap-2 font-dmsans w-full md:w-auto mt-4 md:mt-0">
            <Plus size={isMobile ? 16 : 18} />
            {t("suggestions.suggestButton")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px] font-dmsans w-[95%] md:w-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-dmsans">
              <span className="text-[#00FF00]">_</span>{t("emptySuggestions.dialogTitle")}
            </DialogTitle>
            <DialogDescription className="font-dmsans text-sm md:text-base">
              {t("emptySuggestions.dialogDescription")}
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
