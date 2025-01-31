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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {formation.image?.url && (
          <div className="relative w-full h-48 -mt-6 -mx-6">
            <img
              src={formation.image.url}
              alt={formation.name}
              className="object-cover w-full h-full rounded-t-lg"
            />
          </div>
        )}
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold">{formation.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-lg">Informations clés</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{getTrainingModality(formation.trainingModality)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Durée : {formation.durationInHours}h</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Accessible</span>
                </div>
                {mainCost && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Euro className="w-4 h-4" />
                    <span>{mainCost.cost}€</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-lg">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{formation.description}</p>
          </div>
        </div>

        <Separator className="my-6" />
        
        {formation.publicRegistrationUrl && (
          <div className="mt-2">
            <a
              href={formation.publicRegistrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-sydologie-green hover:bg-sydologie-green/90 text-white py-2 px-4 rounded text-center inline-block transition-colors"
            >
              S'inscrire à la formation
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FormationDialog;