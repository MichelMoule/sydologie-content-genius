
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgramForm, formSchema } from "@/components/program/ProgramForm";
import { ProgramAnalysis } from "@/components/program/ProgramAnalysis";
import { ProgramData } from "@/components/program/types";
import { generateProgramPDF } from "@/components/program/ProgramPDF";
import { supabase } from "@/integrations/supabase/client";

const Program = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [programData, setProgramData] = useState<ProgramData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [programName, setProgramName] = useState("");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsGenerating(true);
      setProgramName(values.programName);
      
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour générer un programme pédagogique.",
        });
        return;
      }

      const { data: programResult, error: programError } = await supabase.functions.invoke('generate-program', {
        body: values,
      });

      if (programError) throw programError;
      
      setProgramData(programResult.program);
      setIsDialogOpen(true);

      toast({
        title: "Succès",
        description: "Votre programme pédagogique a été généré avec succès.",
      });

    } catch (error) {
      console.error("Error generating program:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du programme pédagogique.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!programData) return;
    generateProgramPDF(programData, programName);
    
    toast({
      title: "PDF généré avec succès",
      description: "Le téléchargement devrait commencer automatiquement.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/outils" className="text-blue-500 hover:underline mb-8 inline-block">
          &lt; Outils
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          <div className="space-y-8">
            <h1 className="text-6xl font-bold">ProgrAImme</h1>
            
            <h2 className="text-3xl font-bold leading-tight">
              Créez rapidement des programmes pédagogiques pour vos formations
            </h2>
            
            <p className="text-lg">
              Utilisez notre outil pour générer automatiquement des programmes pédagogiques 
              adaptés à vos besoins spécifiques.
            </p>
            
            <p className="text-lg">
              Notre système d'IA vous aide à structurer vos formations avec des modules, 
              des objectifs d'apprentissage et des activités pédagogiques pertinentes.
            </p>
          </div>
          
          <ProgramForm onSubmit={onSubmit} isGenerating={isGenerating} />
        </div>

        <Dialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          modal={true}
        >
          <DialogContent 
            className="max-w-[90vw] w-[1200px] max-h-[90vh] overflow-y-auto"
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>📚 {programName}</span>
                {programData && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger PDF
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>
            {programData && <ProgramAnalysis program={programData} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Program;
