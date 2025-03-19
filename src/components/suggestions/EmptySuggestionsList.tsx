
import { LightbulbIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";

type EmptySuggestionsListProps = {
  user: any;
  setSuggestions: React.Dispatch<React.SetStateAction<any[]>>;
};

const EmptySuggestionsList = ({ user, setSuggestions }: EmptySuggestionsListProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="text-center py-8 md:py-12 bg-[#F2FCE2] rounded-lg border border-sydologie-green/20 font-dmsans">
      <LightbulbIcon className="mx-auto h-10 w-10 md:h-12 md:w-12 text-sydologie-green mb-4" />
      <h3 className="text-lg md:text-xl font-medium mb-2">{t("emptySuggestions.title")}</h3>
      <p className="text-gray-600 mb-6 px-4 text-sm md:text-base">{t("emptySuggestions.subtitle")}</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-sydologie-green text-white hover:bg-sydologie-green/90 font-dmsans">
            {t("emptySuggestions.button")}
          </Button>
        </DialogTrigger>
        <DialogContent className="font-dmsans w-[95%] md:w-auto">
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

export default EmptySuggestionsList;
