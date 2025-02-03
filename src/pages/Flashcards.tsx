import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Rotate3D } from "lucide-react";

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
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

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