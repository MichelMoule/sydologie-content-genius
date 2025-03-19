
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgramForm, formSchema } from "@/components/program/ProgramForm";
import { ProgramAnalysis } from "@/components/program/ProgramAnalysis";
import { ProgramData } from "@/components/program/types";
import { generateProgramPDF } from "@/components/program/ProgramPDF";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/use-language";

const Program = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [programData, setProgramData] = useState<ProgramData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [programName, setProgramName] = useState("");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsGenerating(true);
      setProgramName(values.programName);
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("program.loginRequired")
        });
        return;
      }

      let fileContent = "";
      if (values.courseFile) {
        const file = values.courseFile as File;
        if (file.size > 5 * 1024 * 1024) {
          toast({
            variant: "destructive",
            title: t("error"),
            description: t("program.fileTooLarge")
          });
          setIsGenerating(false);
          return;
        }

        if (!file.name.toLowerCase().endsWith('.docx')) {
          toast({
            variant: "destructive",
            title: t("program.unsupportedFormat"),
            description: t("program.fileTypeError")
          });
          setIsGenerating(false);
          return;
        }

        fileContent = await readFileContent(file);
      }

      const requestBody = {
        ...values,
        fileContent: fileContent
      };
      const {
        data: programResult,
        error: programError
      } = await supabase.functions.invoke('generate-program', {
        body: requestBody
      });
      if (programError) throw programError;
      setProgramData(programResult.program);
      setIsDialogOpen(true);
      toast({
        title: t("success"),
        description: t("program.successMessage")
      });
    } catch (error) {
      console.error("Error generating program:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("program.errorMessage")
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target && typeof event.target.result === 'string') {
          resolve(event.target.result);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => {
        reject(new Error("File reading error"));
      };
      if (file.type === "application/pdf") {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handleDownloadPDF = () => {
    if (!programData) return;
    generateProgramPDF(programData, programName);
    toast({
      title: t("success"),
      description: t("program.pdfSuccess")
    });
  };

  return (
    <div className="min-h-screen bg-background font-dmsans flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Link to="/outils" className="text-sydologie-green hover:underline mb-8 inline-block font-dmsans">
          &lt; {t("tools.backToTools")}
        </Link>
        
        <div className="flex flex-col space-y-8 mt-8">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold font-dmsans">{t("program.title")}</h1>
            <h2 className="text-3xl font-bold leading-tight font-dmsans">
              {t("program.subtitle")}
            </h2>
          </div>
          
          <div className="w-full max-w-4xl mx-auto">
            <ProgramForm onSubmit={onSubmit} isGenerating={isGenerating} />
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
          <DialogContent className="max-w-[90vw] w-[1200px] max-h-[90vh] overflow-y-auto font-dmsans" onPointerDownOutside={e => e.preventDefault()} onInteractOutside={e => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center font-dmsans">
                <span>📚 {programName}</span>
                {programData && (
                  <Button variant="outline" size="sm" className="ml-4 font-dmsans" onClick={handleDownloadPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    {t("program.form.download")}
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>
            {programData && <ProgramAnalysis program={programData} />}
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  );
};

export default Program;
