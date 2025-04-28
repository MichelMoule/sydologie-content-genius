import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";

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
    if (formation.name.startsWith('Le Bahut')) {
      return "Alternance";
    }
    
    const interIntraFormations = [
      "Automatisation, IA et développement assisté",
      "Concevoir et produire des ressources e-learning",
      "IA et pédagogie (2 jours)"
    ];
    
    if (interIntraFormations.some(title => formation.name.includes(title))) {
      return "INTER et INTRA";
    }
    
    return "INTRA uniquement";
  };

  const isBoosterIAFormation = formation.name.includes("Booster IA : Automatisez les processus métier");
  
  return (
    <Card 
      className={`flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group font-dmsans
        ${isBoosterIAFormation ? 'ring-2 ring-[#72BB8E] relative' : ''}`} 
      onClick={onClick}
    >
      {isBoosterIAFormation && (
        <div className="absolute -top-4 left-4 z-10 flex gap-2">
          <Badge className="bg-[#72BB8E] text-white">CPF</Badge>
          <Badge variant="outline" className="bg-white">
            Prochaine session : 15 mai - 4 juillet
          </Badge>
        </div>
      )}
      
      {formation.image?.url && (
        <div className="relative w-full h-36 md:h-48 overflow-hidden rounded-t-lg">
          <img
            src={formation.image.url}
            alt={formation.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {isBoosterIAFormation && (
            <div className="absolute bottom-0 left-0 right-0 bg-[#72BB8E]/90 text-white p-2 text-sm">
              9 jours de formation sur 8 semaines
            </div>
          )}
        </div>
      )}
      
      <CardHeader className="py-3 md:py-4">
        <CardTitle className="text-base md:text-xl line-clamp-2 mb-2 md:mb-4 font-dmsans">{formation.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-3 md:gap-4 pt-0">
        <div className="space-y-2 md:space-y-3 flex-grow">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
            <span>{getTrainingModality(formation.trainingModality)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
            <span>Durée : {formation.durationInHours}h</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <User className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
            <span>{getFormationType(formation)}</span>
          </div>
        </div>
        <Button 
          className="w-full bg-[#72BB8E] hover:bg-[#72BB8E]/90 text-white rounded-[40px] h-[36px] md:h-[40px] text-sm md:text-base font-dmsans"
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
