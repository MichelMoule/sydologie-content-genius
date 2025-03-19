import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Rotate3D, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

const Flashcards = () => {
  const { toast } = useToast();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [content, setContent] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [numberOfCards, setNumberOfCards] = useState(5);

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
        body: { 
          content,
          numberOfCards: Math.min(Math.max(1, numberOfCards), 20) // Limite entre 1 et 20 cartes
        },
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
    <div className="min-h-screen bg-background font-dmsans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/outils" className="text-sydologie-green hover:underline mb-8 inline-block font-dmsans">
          &lt; Outils
        </Link>
        
        <div className="flex flex-col space-y-8 mt-8">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold font-dmsans">FLASHCARDS</h1>
            <h2 className="text-3xl font-bold leading-tight font-dmsans">
              Générez des cartes pour mémoriser vos contenus
            </h2>
            <p className="text-lg font-dmsans">
              Utilisez l'IA pour générer des flashcards à partir de vos contenus de formation.
            </p>
          </div>

          <div className="w-full max-w-4xl mx-auto space-y-4">
            <div className="p-4 border rounded-lg space-y-4">
              <h3 className="text-xl font-semibold mb-4 font-dmsans">Génération par IA</h3>
              <div className="space-y-2">
                <label htmlFor="numberOfCards" className="text-sm font-medium font-dmsans">
                  Nombre de flashcards à générer (1-20)
                </label>
                <Input
                  id="numberOfCards"
                  type="number"
                  min="1"
                  max="20"
                  value={numberOfCards}
                  onChange={(e) => setNumberOfCards(Math.min(Math.max(1, parseInt(e.target.value) || 1), 20))}
                  className="w-full font-dmsans"
                />
              </div>
              <Textarea
                placeholder="Collez votre contenu ici pour générer automatiquement des flashcards..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[150px] font-dmsans"
              />
              <Button 
                onClick={handleGenerateCards} 
                className="w-full font-dmsans"
                disabled={isGenerating}
              >
                <Wand2 className="mr-2" />
                {isGenerating ? "Génération en cours..." : "Générer des flashcards"}
              </Button>
            </div>

            {cards.length > 0 && (
              <div className="mt-8 space-y-4">
                <Card className="relative p-6 min-h-[200px] flex items-center justify-center cursor-pointer font-dmsans"
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
                    <p className="text-sm text-muted-foreground mb-2 font-dmsans">
                      Carte {currentCardIndex + 1} sur {cards.length}
                    </p>
                    <p className="text-xl font-dmsans">
                      {isFlipped ? currentCard.back : currentCard.front}
                    </p>
                  </div>
                </Card>

                <div className="flex justify-between">
                  <Button onClick={handlePrevious} disabled={cards.length <= 1} className="font-dmsans">
                    Précédent
                  </Button>
                  <Button onClick={handleNext} disabled={cards.length <= 1} className="font-dmsans">
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
