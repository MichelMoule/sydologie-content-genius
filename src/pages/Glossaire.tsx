
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, BookOpen, Loader2, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface GlossaryTerm {
  term: string;
  definition: string;
}

interface GlossaryResponse {
  glossary: {
    terms: GlossaryTerm[];
  };
}

const Glossaire = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("");
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez sélectionner un fichier PDF",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !subject) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subject", subject);

      const { data, error } = await supabase.functions.invoke<GlossaryResponse>("generate-glossary", {
        body: formData,
      });

      if (error) throw error;

      setGlossary(data.glossary.terms);
      
      toast({
        title: "Glossaire généré avec succès",
        description: "Votre glossaire est prêt à être utilisé",
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la génération",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadGlossary = () => {
    const content = glossary
      .map(({ term, definition }) => `${term}\n${definition}\n\n`)
      .join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glossaire-${subject.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">GlossAIre</h1>
            <p className="text-xl text-zinc-600">
              Générez automatiquement des glossaires à partir de vos supports de formation PDF
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Créer un nouveau glossaire</CardTitle>
              <CardDescription>
                Importez votre PDF et précisez le sujet pour obtenir un glossaire pertinent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet de la formation</Label>
                  <Input
                    id="subject"
                    placeholder="Ex: Intelligence Artificielle, Management..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Document PDF</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-zinc-50 border-zinc-300 hover:bg-zinc-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 mb-2 text-zinc-500" />
                        <p className="mb-2 text-sm text-zinc-600">
                          <span className="font-bold">Cliquez pour charger</span> ou glissez-déposez
                        </p>
                        <p className="text-xs text-zinc-500">PDF (MAX. 10MB)</p>
                      </div>
                      <input
                        id="file"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                  </div>
                  {file && (
                    <p className="text-sm text-zinc-600">
                      Fichier sélectionné : {file.name}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Générer le glossaire
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {glossary.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Glossaire généré</CardTitle>
                  <CardDescription>
                    {glossary.length} termes identifiés
                  </CardDescription>
                </div>
                <Button onClick={downloadGlossary} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {glossary.map(({ term, definition }, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <h3 className="font-semibold text-lg mb-1">{term}</h3>
                      <p className="text-zinc-600">{definition}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Glossaire;
