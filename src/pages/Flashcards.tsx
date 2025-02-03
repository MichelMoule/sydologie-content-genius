import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Rotate3D, Wand2 } from "lucide-react";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

const Flashcards = () => {
  const { toast } = useToast();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [content, setContent] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddCard = () => {
    if (!front || !back) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir les deux côtés de la carte",
      });
      return;
    }

    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      front,
      back,
    };

    setCards([...cards, newCard]);
    setFront("");
    setBack("");

    toast({
      title: "Succès",
      description: "La carte a été ajoutée",
    });
  };

  const handleGenerateCards = async () => {
    if (!content) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez fournir du contenu pour générer les flashcards",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: { content },
      });

      if (error) throw error;

      const generatedCards = data.flashcards.map((card: { front: string; back: string }) => ({
        id: crypto.randomUUID(),
        front: card.front,
        back: card.back,
      }));

      setCards(generatedCards);
      setContent("");
      
      toast({
        title: "Succès",
        description: `${generatedCards.length} flashcards ont été générées`,
      });
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération des flashcards",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const currentCard = cards[currentCardIndex];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/outils" className="text-sydologie-green hover:underline mb-8 inline-block">
          &lt; Outils
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          <div className="space-y-8">
            <h1 className="text-6xl font-bold">FLASHCARDS</h1>
            
            <h2 className="text-3xl font-bold leading-tight">
              Créez des cartes pour mémoriser vos contenus
            </h2>
            
            <p className="text-lg">
              Utilisez les flashcards pour réviser et mémoriser efficacement vos contenus de formation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="text-xl font-semibold mb-4">Génération par IA</h3>
                <Textarea
                  placeholder="Collez votre contenu ici pour générer automatiquement des flashcards..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px]"
                />
                <Button 
                  onClick={handleGenerateCards} 
                  className="w-full"
                  disabled={isGenerating}
                >
                  <Wand2 className="mr-2" />
                  {isGenerating ? "Génération en cours..." : "Générer des flashcards"}
                </Button>
              </div>

              <div className="p-4 border rounded-lg space-y-4">
                <h3 className="text-xl font-semibold mb-4">Création manuelle</h3>
                <Input
                  placeholder="Recto de la carte"
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                />
                <Textarea
                  placeholder="Verso de la carte"
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                />
                <Button onClick={handleAddCard} className="w-full">
                  Ajouter une carte
                </Button>
              </div>
            </div>

            {cards.length > 0 && (
              <div className="mt-8 space-y-4">
                <Card className="relative p-6 min-h-[200px] flex items-center justify-center cursor-pointer"
                      onClick={() => setIsFlipped(!isFlipped)}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(!isFlipped);
                    }}
                  >
                    <Rotate3D className="h-4 w-4" />
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Carte {currentCardIndex + 1} sur {cards.length}
                    </p>
                    <p className="text-xl">
                      {isFlipped ? currentCard.back : currentCard.front}
                    </p>
                  </div>
                </Card>

                <div className="flex justify-between">
                  <Button onClick={handlePrevious} disabled={cards.length <= 1}>
                    Précédent
                  </Button>
                  <Button onClick={handleNext} disabled={cards.length <= 1}>
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;