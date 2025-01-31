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

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group" onClick={onClick}>
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
        <CardTitle className="text-xl line-clamp-2 mb-4">{formation.name}</CardTitle>
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
            <span>Accessible</span>
          </div>
        </div>
        <Button 
          className="w-full bg-[#1EFF02] hover:bg-[#1EFF02]/90 text-black"
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