
import Navbar from "@/components/Navbar";

const Annuaire = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Annuaire des outils</h1>
        <p className="text-lg text-muted-foreground">
          Une sélection d'outils externes pour enrichir vos formations.
        </p>
      </div>
    </div>
  );
};

export default Annuaire;
