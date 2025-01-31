import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import FormationFilters, { FormationType } from "@/components/FormationFilters";
import FormationDialog from "@/components/FormationDialog";
import FormationCard from "@/components/FormationCard";

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

const Formations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<FormationType>("all");
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  
  const { data: formations, isLoading, error } = useQuery({
    queryKey: ['formations'],
    queryFn: fetchFormations,
  });

  const filteredFormations = useMemo(() => {
    if (!formations) return [];

    return formations.filter(formation => {
      const matchesSearch = formation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          formation.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === "all" || 
                         (selectedType === "presentielle" && formation.trainingModality.toLowerCase().includes("présentiel")) ||
                         (selectedType === "mixte" && formation.trainingModality.toLowerCase().includes("mixte")) ||
                         (selectedType === "a-distance" && formation.trainingModality.toLowerCase().includes("distance"));

      return matchesSearch && matchesType;
    });
  }, [formations, searchQuery, selectedType]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Nos Formations
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Découvrez nos formations pour développer vos compétences et atteindre vos objectifs professionnels.
        </p>
      </section>

      {/* Filters Section */}
      <section className="container mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-full md:w-[300px]">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher une formation..."
            />
          </div>
          <FormationFilters 
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />
        </div>
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
                  <div className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <div className="space-y-3 mb-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))
            ) : (
              filteredFormations.map((formation) => (
                <FormationCard 
                  key={formation.id} 
                  formation={formation}
                  onClick={() => setSelectedFormation(formation)}
                />
              ))
            )}
          </div>
        )}
        
        {!isLoading && filteredFormations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucune formation ne correspond à vos critères de recherche.
          </div>
        )}
      </section>

      <FormationDialog
        formation={selectedFormation}
        open={!!selectedFormation}
        onOpenChange={(open) => !open && setSelectedFormation(null)}
      />
    </div>
  );
};

export default Formations;