import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Euro, MapPin } from "lucide-react";

interface Formation {
  id: string;
  name: string;
  description: string;
  duration: string;
  durationInHours: number;
  trainingModality: string;
  publicRegistrationUrl: string;
  image?: {
    filename: string;
    id: string;
    mime: string;
    size: number;
    url: string;
  };
  costs: {
    cost: number;
    costMode: string;
    type: string;
  }[];
}

const fetchFormations = async (): Promise<Formation[]> => {
  const { data, error } = await supabase.functions.invoke('get-formations');
  
  if (error) throw error;
  if (!data?.data?.programs) throw new Error('No formations found');
  
  return data.data.programs;
};

const FormationCard = ({ formation }: { formation: Formation }) => {
  const mainCost = formation.costs.find(cost => cost.type === 'INTER');
  
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      {formation.image?.url && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={formation.image.url}
            alt={formation.name}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl line-clamp-2">{formation.name}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2 mt-2">
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
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
          {formation.description}
        </p>
        {formation.publicRegistrationUrl && (
          <Button 
            className="w-full bg-sydologie-green hover:bg-sydologie-green/90 mt-auto"
            onClick={() => window.open(formation.publicRegistrationUrl, '_blank')}
          >
            En savoir plus
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const Formations = () => {
  const { data: formations, isLoading, error } = useQuery({
    queryKey: ['formations'],
    queryFn: fetchFormations,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Nos Formations
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
          Découvrez nos formations pour développer vos compétences et atteindre vos objectifs professionnels.
        </p>
      </section>

      {/* Formations list */}
      <section className="container mx-auto px-4 pb-16">
        {error ? (
          <div className="text-sydologie-red text-center py-8">
            Une erreur est survenue lors du chargement des formations.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <div className="w-full h-48 bg-muted rounded-t-lg">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              formations?.map((formation) => (
                <FormationCard key={formation.id} formation={formation} />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Formations;