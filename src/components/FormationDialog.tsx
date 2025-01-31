import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Euro, MapPin } from "lucide-react";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {formation.image?.url && (
          <div className="relative w-full h-48 -mt-6 -mx-6 mb-4">
            <img
              src={formation.image.url}
              alt={formation.name}
              className="object-cover w-full h-full rounded-t-lg"
            />
          </div>
        )}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{formation.name}</DialogTitle>
          <DialogDescription className="flex flex-wrap gap-4 mt-2">
            <span className="inline-flex items-center text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {formation.durationInHours}h
            </span>
            <span className="inline-flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {formation.trainingModality}
            </span>
            {mainCost && (
              <span className="inline-flex items-center text-sm">
                <Euro className="w-4 h-4 mr-1" />
                {mainCost.cost}€
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{formation.description}</p>
        </div>
        {formation.publicRegistrationUrl && (
          <div className="mt-6">
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