import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const Formations = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Nos Formations
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-12">
          Découvrez nos formations pour développer vos compétences et atteindre vos objectifs professionnels.
        </p>
      </section>

      {/* Placeholder for formations list */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example formation card - will be replaced with real data */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Formation à venir</CardTitle>
              <CardDescription>Plus d'informations bientôt disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Restez à l'écoute pour découvrir nos prochaines formations.
              </p>
              <Button className="w-full bg-sydologie-green hover:bg-sydologie-green/90">
                En savoir plus
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Formations;