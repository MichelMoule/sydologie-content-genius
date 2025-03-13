
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Clock, Euro, MapPin, User } from "lucide-react";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] lg:max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column with image and key information */}
          <div className="space-y-6">
            {formation.image?.url && (
              <div className="relative w-full h-64 -mt-6 -ml-6 rounded-tl-lg overflow-hidden">
                <img
                  src={formation.image.url}
                  alt={formation.name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4 text-lg">Informations clés</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{getTrainingModality(formation.trainingModality)}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>Durée : {formation.durationInHours}h</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <User className="w-5 h-5" />
                  <span>Accessible</span>
                </div>
                {mainCost && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Euro className="w-5 h-5" />
                    <span>{mainCost.cost}€</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column with title and description */}
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">{formation.name}</DialogTitle>
            </DialogHeader>

            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4 text-lg">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{formation.description}</p>
            </div>

            {formation.publicRegistrationUrl && (
              <div>
                <a
                  href={formation.publicRegistrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#72BB8E] hover:bg-[#72BB8E]/90 text-white py-3 px-4 rounded-[40px] h-[40px] inline-block text-center"
                >
                  S'inscrire à la formation
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormationDialog;
