
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Clock, Euro, MapPin, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FormationDialogProps {
  formation: {
    id: string;
    name: string;
    description: string;
    duration: string;
    durationInHours: number;
    trainingModality: string;
    publicRegistrationUrl: string;
    image?: {
      url: string;
    };
    costs: {
      cost: number;
      costMode: string;
      type: string;
    }[];
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FormationDialog = ({ formation, open, onOpenChange }: FormationDialogProps) => {
  if (!formation) return null;

  const mainCost = formation.costs.find((cost) => cost.type === "INTER");
  
  const getTrainingModality = (modality: string) => {
    if (typeof modality !== 'string') return 'Formation';
    return `Formation ${modality.toLowerCase()}`;
  };

  const getFormationType = (formation: NonNullable<FormationDialogProps['formation']>) => {
    // If formation name starts with "Le Bahut", return "Alternance"
    if (formation.name.startsWith('Le Bahut')) {
      return "Alternance";
    }
    
    // Specific formations that should be "INTER et INTRA"
    const interIntraFormations = [
      "Automatisation, IA et développement assisté",
      "Concevoir et produire des ressources e-learning",
      "IA et pédagogie (2 jours)"
    ];
    
    if (interIntraFormations.some(title => formation.name.includes(title))) {
      return "INTER et INTRA";
    }
    
    // All other formations are "INTRA uniquement"
    return "INTRA uniquement";
  };

  // Remove '/registration' from the end of the URL if it exists
  const formationPageUrl = formation.publicRegistrationUrl.replace(/\/registration$/, '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] lg:max-w-[1000px] max-h-[90vh] p-0 overflow-hidden font-dmsans">
        <ScrollArea className="max-h-[90vh] overflow-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column with image and key information */}
              <div className="space-y-6">
                {formation.image?.url && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <img
                      src={formation.image.url}
                      alt={formation.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4 text-lg text-[#1F5E40] font-dmsans">Informations clés</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-muted-foreground font-dmsans">
                      <MapPin className="w-5 h-5 text-[#1F5E40]" />
                      <span>{getTrainingModality(formation.trainingModality)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground font-dmsans">
                      <Clock className="w-5 h-5 text-[#1F5E40]" />
                      <span>Durée : {formation.durationInHours}h</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground font-dmsans">
                      <User className="w-5 h-5 text-[#1F5E40]" />
                      <span>{getFormationType(formation)}</span>
                    </div>
                    {mainCost && (
                      <div className="flex items-center gap-3 text-muted-foreground font-dmsans">
                        <Euro className="w-5 h-5 text-[#1F5E40]" />
                        <span>{mainCost.cost}€</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column with title and description */}
              <div className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-[#1F5E40] font-dmsans">{formation.name}</DialogTitle>
                </DialogHeader>

                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4 text-lg text-[#1F5E40] font-dmsans">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap font-dmsans">{formation.description}</p>
                </div>

                {formationPageUrl && (
                  <div>
                    <a
                      href={formationPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#72BB8E] hover:bg-[#72BB8E]/90 text-white py-3 px-4 rounded-[40px] h-[40px] inline-block text-center font-dmsans"
                    >
                      S'inscrire à la formation
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FormationDialog;
