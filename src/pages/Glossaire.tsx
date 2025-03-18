import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, BookOpen, Loader2, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (!fileType || !['txt', 'docx'].includes(fileType)) {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez sélectionner un fichier .txt ou .docx",
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

      console.log("Envoi de la requête à l'API...");
      const { data, error } = await supabase.functions.invoke<GlossaryResponse>(
        "generate-glossary", 
        {
          body: formData,
        }
      );

      if (error) {
        console.error("Erreur API:", error);
        throw error;
      }

      console.log("Réponse API:", data);
      
      if (!data?.glossary?.terms) {
        console.error("Format de réponse invalide:", data);
        throw new Error("Format de réponse invalide");
      }

      setGlossary(data.glossary.terms);
      console.log("Glossaire mis à jour:", data.glossary.terms);
      
      toast({
        title: "Glossaire généré avec succès",
        description: `${data.glossary.terms.length} termes ont été identifiés`,
      });
    } catch (error: any) {
      console.error("Erreur complète:", error);
      toast({
        title: "Erreur lors de la génération",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadGlossary = () => {
    if (!glossary.length) {
      toast({
        title: "Aucun glossaire à télécharger",
        description: "Veuillez d'abord générer un glossaire",
        variant: "destructive",
      });
      return;
    }

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
    <div className="min-h-screen bg-zinc-50 font-dmsans">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/outils" className="text-sydologie-green hover:underline mb-8 inline-block font-dmsans">
          &lt; Outils
        </Link>
        
        <div className="flex flex-col space-y-8 mt-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold mb-4 font-dmsans">GlossAIre</h1>
            <p className="text-xl text-zinc-600 font-dmsans">
              Générez automatiquement des glossaires à partir de vos supports de formation Word ou TXT
            </p>
          </div>

          <div className="w-full max-w-3xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-dmsans">Créer un nouveau glossaire</CardTitle>
                <CardDescription className="font-dmsans">
                  Importez votre fichier Word ou TXT et précisez le sujet pour obtenir un glossaire pertinent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="font-dmsans">Sujet de la formation</Label>
                    <Input
                      id="subject"
                      placeholder="Ex: Intelligence Artificielle, Management..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="font-dmsans"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file" className="font-dmsans">Document (Word ou TXT)</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-zinc-50 border-zinc-300 hover:bg-zinc-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-8 w-8 mb-2 text-zinc-500" />
                          <p className="mb-2 text-sm text-zinc-600 font-dmsans">
                            <span className="font-bold font-dmsans">Cliquez pour charger</span> ou glissez-déposez
                          </p>
                          <p className="text-xs text-zinc-500 font-dmsans">Word ou TXT (MAX. 10MB)</p>
                        </div>
                        <input
                          id="file"
                          type="file"
                          accept=".txt,.docx"
                          className="hidden"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    </div>
                    {file && (
                      <p className="text-sm text-zinc-600 font-dmsans">
                        Fichier sélectionné : {file.name}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-dmsans"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="font-dmsans">Génération en cours...</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span className="font-dmsans">Générer le glossaire</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {glossary && glossary.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="font-dmsans">Glossaire généré</CardTitle>
                    <CardDescription className="font-dmsans">
                      {glossary.length} termes identifiés
                    </CardDescription>
                  </div>
                  <Button onClick={downloadGlossary} variant="outline" className="font-dmsans">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-dmsans">Terme</TableHead>
                        <TableHead className="font-dmsans">Définition</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {glossary.map((term, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-semibold font-dmsans">{term.term}</TableCell>
                          <TableCell className="font-dmsans">{term.definition}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Glossaire;
