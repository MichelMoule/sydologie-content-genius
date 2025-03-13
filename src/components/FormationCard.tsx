
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, User } from "lucide-react";

interface FormationCardProps {
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
  };
  onClick: () => void;
}

const FormationCard = ({ formation, onClick }: FormationCardProps) => {
  const getTrainingModality = (modality: string) => {
    if (typeof modality !== 'string') return 'Formation';
    return `Formation ${modality.toLowerCase()}`;
  };

  const getFormationType = (formation: FormationCardProps['formation']) => {
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

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group font-dmsans" onClick={onClick}>
      {formation.image?.url && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={formation.image.url}
            alt={formation.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl line-clamp-2 mb-4 font-dmsans">{formation.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <div className="space-y-3 flex-grow">
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
            <span>{getFormationType(formation)}</span>
          </div>
        </div>
        <Button 
          className="w-full bg-[#72BB8E] hover:bg-[#72BB8E]/90 text-white rounded-[40px] h-[40px] font-dmsans"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          En savoir plus
        </Button>
      </CardContent>
    </Card>
  );
};

export default FormationCard;
