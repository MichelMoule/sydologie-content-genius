import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import FormationDialog from "@/components/FormationDialog";
import FormationCard from "@/components/FormationCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
  const {
    data,
    error
  } = await supabase.functions.invoke('get-formations');
  if (error) throw error;
  if (!data?.data?.programs) throw new Error('No formations found');
  return data.data.programs;
};
const Formations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const navigate = useNavigate();
  const {
    data: formations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['formations'],
    queryFn: fetchFormations
  });
  const filteredFormations = useMemo(() => {
    if (!formations) return [];
    return formations.filter(formation => {
      const matchesSearch = formation.name.toLowerCase().includes(searchQuery.toLowerCase()) || formation.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [formations, searchQuery]);
  return <div className="min-h-screen bg-background font-dmsans">
      <Navbar />
      
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <span className="text-[12vw] font-bold text-[#72BB8E] whitespace-nowrap font-dmsans">
            FORMATIONS
          </span>
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold font-dmsans">
                Nous proposons des formations{" "}
                <span className="text-[#72BB8E]">
                  interactives et innovantes.
                </span>
              </h1>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Concevoir un e-learning, réaliser un PowerPoint pédagogique, savoir expliquer avec des schémas ou des illustrations, réaliser une vidéo pédagogique, utiliser le jeu pour transmettre des connaissances, découvrir et utiliser les liens entre neurosciences et pédagogie...
                </p>
                <p>
                  De manière générale, nous vous formons sur tout ce qui peut vous permettre de concevoir et réaliser des formations efficaces grâce à l'intelligence artificielle !
                </p>
              </div>
            </div>
            <div className="bg-[#72BB8E]/10 p-8 rounded-lg">
              <p className="text-lg">
                Nous organisons des formations intra-entreprise dans vos locaux et des formations inter-entreprises à distance.
                Découvrez nos formations ci-dessous 👇
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="w-full md:w-[300px]">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Rechercher une formation..." />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        {error ? <div className="text-sydologie-red text-center py-8">
            Une erreur est survenue lors du chargement des formations.
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? Array.from({
          length: 6
        }).map((_, index) => <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
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
                </Card>) : filteredFormations.map(formation => <FormationCard key={formation.id} formation={formation} onClick={() => setSelectedFormation(formation)} />)}
          </div>}
        
        {!isLoading && filteredFormations.length === 0 && <div className="text-center py-8 text-muted-foreground">
            Aucune formation ne correspond à vos critères de recherche.
          </div>}
      </section>

      <section className="container mx-auto px-4 py-16 mt-8">
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-dmsans">
            Vous ne trouvez pas la formation adaptée ?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Nous pouvons créer une formation sur mesure adaptée à vos besoins spécifiques. 
            Contactez-nous pour discuter de votre projet.
          </p>
          <Button onClick={() => navigate('/contact')} className="bg-[#72BB8E] hover:bg-[#72BB8E]/90 text-white rounded-[40px] h-[40px] px-8 font-dmsans">Je souhaiterais demander une formation sur mesure</Button>
        </div>
      </section>

      <FormationDialog formation={selectedFormation} open={!!selectedFormation} onOpenChange={open => !open && setSelectedFormation(null)} />
    </div>;
};
export default Formations;