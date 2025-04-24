
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Copy, Check, Download } from "lucide-react";
import type { PromptResult as PromptResultType, GeneratedPrompt, ImprovedPrompt } from "./types";

function isGeneratedPrompt(result: PromptResultType): result is GeneratedPrompt {
  return 'sections' in result;
}

function isImprovedPrompt(result: PromptResultType): result is ImprovedPrompt {
  return 'score' in result;
}

interface PromptResultProps {
  result: PromptResultType;
}

export function PromptResult({ result }: PromptResultProps) {
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [copied, setCopied] = useState(false);

  // Fonction pour copier le prompt
  const copyPrompt = () => {
    const textToCopy = isGeneratedPrompt(result) 
      ? stripHtmlTags(result.prompt) 
      : stripHtmlTags(result.improvedPrompt);

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fonction pour télécharger le prompt en tant que fichier texte
  const downloadPrompt = () => {
    const textToDownload = isGeneratedPrompt(result) 
      ? stripHtmlTags(result.prompt) 
      : stripHtmlTags(result.improvedPrompt);
    
    const blob = new Blob([textToDownload], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fonction pour supprimer les balises HTML
  const stripHtmlTags = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>
          {isGeneratedPrompt(result) ? "Prompt généré" : "Analyse et amélioration du prompt"}
        </CardTitle>
        <CardDescription>
          {isGeneratedPrompt(result) 
            ? "Voici le prompt optimisé pour votre besoin" 
            : `Score du prompt : ${result.score}/100`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="p-6">
            <div className="prose max-w-none">
              {isGeneratedPrompt(result) ? (
                <div dangerouslySetInnerHTML={{ __html: result.prompt }} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: result.improvedPrompt }} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="p-6">
            {isGeneratedPrompt(result) && (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Explication</h3>
                  <p className="text-sm text-muted-foreground">{result.explanation}</p>
                </div>

                <h3 className="text-lg font-semibold mb-2">Structure du prompt</h3>
                <Accordion type="single" collapsible className="w-full">
                  {result.sections.map((section, index) => (
                    <AccordionItem key={index} value={`section-${index}`}>
                      <AccordionTrigger className="font-medium">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="mb-2">
                          <h4 className="font-medium">Contenu</h4>
                          <p className="text-sm">{section.content}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Objectif</h4>
                          <p className="text-sm">{section.purpose}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}

            {isImprovedPrompt(result) && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Points forts</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.evaluation.strengths.map((strength, index) => (
                        <li key={index} className="text-sm">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Points faibles</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.evaluation.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">Améliorations proposées</h3>
                <Accordion type="single" collapsible className="w-full">
                  {result.improvements.map((improvement, index) => (
                    <AccordionItem key={index} value={`improvement-${index}`}>
                      <AccordionTrigger className="font-medium">
                        {improvement.type}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="mb-2">
                          <h4 className="font-medium">Description</h4>
                          <p className="text-sm">{improvement.description}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Justification</h4>
                          <p className="text-sm">{improvement.reason}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4">
        <Button variant="outline" size="sm" onClick={downloadPrompt}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </Button>
        <Button variant="secondary" size="sm" onClick={copyPrompt}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copié !
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copier
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
