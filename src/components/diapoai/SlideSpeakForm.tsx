import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  SlideSpeakTaskResult,
  SlideSpeakGenerateParams,
  SlideSpeakTemplate,
  slideSpeakService,
} from "@/services/slidespeak";

export const formSchema = z.object({
  content: z.string().min(10, {
    message: "Le contenu est requis (minimum 10 caractères)",
  }),
  tone: z.string().optional(),
  verbosity: z.string().optional(),
  length: z.number().int().min(1).max(50).optional(),
  template: z.string().optional(),
  custom_instructions: z.string().optional(),
});

interface SlideSpeakFormProps {
  onPresentationGenerated: (url: string) => void;
  onPresentationGenerating?: (status: boolean) => void;
}

export const SlideSpeakForm = ({ 
  onPresentationGenerated,
  onPresentationGenerating
}: SlideSpeakFormProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<SlideSpeakTaskResult | null>(null);
  const [activeTab, setActiveTab] = useState("content");
  const [fileContent, setFileContent] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<SlideSpeakTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const pollingIntervalIdRef = useRef<number | null>(null);
  const successNotifiedRef = useRef(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      tone: "professional",
      verbosity: "standard",
      length: 10,
      template: "default",
      custom_instructions: "",
    },
  });

  useEffect(() => {
    return () => {
      if (pollingIntervalIdRef.current !== null) {
        clearInterval(pollingIntervalIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const fetchedTemplates = await slideSpeakService.getTemplates();
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error("Erreur lors du chargement des templates:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les templates de présentation.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    loadTemplates();
  }, [toast]);

  useEffect(() => {
    if (taskId) {
      successNotifiedRef.current = false;
    }
    
    if (!taskId) return;

    if (pollingIntervalIdRef.current !== null) {
      clearInterval(pollingIntervalIdRef.current);
      pollingIntervalIdRef.current = null;
    }

    const checkTaskStatus = async () => {
      try {
        const status = await slideSpeakService.getTaskStatus(taskId);
        setTaskStatus(status);

        if (status.task_status === "SUCCESS" && status.task_result?.url) {
          if (pollingIntervalIdRef.current !== null) {
            clearInterval(pollingIntervalIdRef.current);
            pollingIntervalIdRef.current = null;
          }
          setIsGenerating(false);
          
          if (onPresentationGenerating) {
            onPresentationGenerating(false);
          }
          
          onPresentationGenerated(status.task_result.url);
          
          if (!successNotifiedRef.current) {
            toast({
              title: "Présentation générée avec succès",
              description: "Votre présentation PowerPoint est prête au téléchargement",
            });
            successNotifiedRef.current = true;
          }
          
          setActiveTab("content");
        } else if (status.task_status === "FAILURE") {
          if (pollingIntervalIdRef.current !== null) {
            clearInterval(pollingIntervalIdRef.current);
            pollingIntervalIdRef.current = null;
          }
          setIsGenerating(false);
          
          if (onPresentationGenerating) {
            onPresentationGenerating(false);
          }
          
          setApiError(
            status.error || "Une erreur est survenue lors de la génération de la présentation"
          );
          
          if (!successNotifiedRef.current) {
            toast({
              title: "Échec de la génération",
              description:
                status.error || "Une erreur est survenue lors de la génération de la présentation",
              variant: "destructive",
            });
            successNotifiedRef.current = true;
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut:", error);
      }
    };

    checkTaskStatus();
    
    const intervalId = window.setInterval(checkTaskStatus, 2000);
    pollingIntervalIdRef.current = intervalId;

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [taskId, onPresentationGenerated, onPresentationGenerating, toast]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      toast({
        title: "Format non supporté",
        description: "Veuillez télécharger un fichier .docx",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      form.setValue("content", content);
    };
    reader.readAsText(file);
  };

  const generatePresentation = async (values: z.infer<typeof formSchema>) => {
    setApiError(null);
    setIsGenerating(true);
    setTaskStatus(null);
    setTaskId(null);
    successNotifiedRef.current = false;
    
    if (onPresentationGenerating) {
      onPresentationGenerating(true);
    }
    
    try {
      const params: SlideSpeakGenerateParams = {
        plain_text: values.content,
        length: values.length,
        template: values.template,
        tone: values.tone as any,
        verbosity: values.verbosity as any,
        custom_user_instructions: values.custom_instructions,
        fetch_images: true,
        include_cover: true,
        include_table_of_contents: true,
      };

      const response = await slideSpeakService.generatePresentation(params);
      setTaskId(response.task_id);

      toast({
        title: "Génération en cours",
        description: "Votre présentation est en cours de génération, veuillez patienter...",
      });
      setActiveTab("content");
    } catch (error: any) {
      console.error("Erreur lors de la génération de la présentation:", error);
      setApiError(error.message || "Une erreur est survenue lors de la génération de la présentation");
      setIsGenerating(false);
      
      if (onPresentationGenerating) {
        onPresentationGenerating(false);
      }
      
      toast({
        title: "Erreur de génération",
        description: "Une erreur est survenue lors de la génération de la présentation",
        variant: "destructive",
      });
    }
  };

  const clearApiError = () => {
    setApiError(null);
  };

  const getProgressValue = () => {
    if (!taskStatus) return 10;
    switch (taskStatus.task_status) {
      case "PENDING":
        return 25;
      case "PROCESSING":
        return 75;
      case "SUCCESS":
        return 100;
      case "FAILURE":
        return 100;
      default:
        return 10;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {apiError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            {apiError}
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={clearApiError}>
                Fermer
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="p-6">
          <h3 className="text-xl font-semibold mb-4">Contenu de la présentation</h3>

          <div className="mb-6">
            <div className="flex flex-col space-y-2 mb-4">
              <Label htmlFor="docxFile">Importer un fichier DOCX (optionnel)</Label>
              <Input
                id="docxFile"
                type="file"
                accept=".docx"
                onChange={handleFileUpload}
                className="max-w-md"
              />
              <p className="text-sm text-muted-foreground">
                Ou saisissez directement votre contenu ci-dessous
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(generatePresentation)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenu*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Saisissez ou collez votre contenu ici..."
                        className="min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Le contenu qui servira de base pour votre diaporama</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => setActiveTab("settings")}
                  disabled={isGenerating}
                >
                  Paramètres avancés
                </Button>

                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Génération en cours...
                    </>
                  ) : (
                    "Générer la présentation"
                  )}
                </Button>
              </div>

              {isGenerating && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {taskStatus?.task_status === "PENDING" && "En attente..."}
                      {taskStatus?.task_status === "PROCESSING" && "Génération en cours..."}
                      {taskStatus?.task_status === "SUCCESS" && "Génération terminée!"}
                      {taskStatus?.task_status === "FAILURE" && "Échec de la génération"}
                    </span>
                    <span className="text-sm text-muted-foreground">{getProgressValue()}%</span>
                  </div>
                  <Progress value={getProgressValue()} className="h-2" />
                </div>
              )}
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="settings" className="p-6">
          <h3 className="text-xl font-semibold mb-4">Paramètres de la présentation</h3>

          <Form {...form}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="template"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template</FormLabel>
                      <FormControl>
                        <Select
                          disabled={isLoadingTemplates}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choisir un template" />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingTemplates ? (
                              <SelectItem value="default">Chargement...</SelectItem>
                            ) : (
                              templates.map((template) => (
                                <SelectItem key={template.name} value={template.name}>
                                  {template.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>Le style visuel de votre présentation</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de diapositives</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={50}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                        />
                      </FormControl>
                      <FormDescription>Nombre approximatif de diapositives (1-50)</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ton</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un ton" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Par défaut</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="professional">Professionnel</SelectItem>
                            <SelectItem value="funny">Amusant</SelectItem>
                            <SelectItem value="educational">Éducatif</SelectItem>
                            <SelectItem value="sales_pitch">Argumentaire commercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>Le ton utilisé pour le texte de la présentation</FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verbosity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau de détail</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un niveau de détail" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="concise">Concis</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="text-heavy">Détaillé</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>La quantité de texte par diapositive</FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="custom_instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions personnalisées</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Instructions spécifiques pour la présentation..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Instructions supplémentaires pour personnaliser votre présentation
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="button" onClick={() => setActiveTab("content")}>
                  Retour au contenu
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};
