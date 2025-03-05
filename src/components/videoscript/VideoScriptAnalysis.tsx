
import { VideoScriptData } from "./types";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface VideoScriptAnalysisProps {
  script: VideoScriptData;
}

export const VideoScriptAnalysis = ({ script }: VideoScriptAnalysisProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyScript = () => {
    // Generate a formatted text version of the script
    const formattedScript = script.script.map(section => {
      return `${section.section}\n\nNarration:\n${section.narration}\n\nVisuels:\n${section.visualNotes}\n\nDurée: ${section.duration}\n\n-----------------\n\n`;
    }).join('');
    
    const fullText = `${script.title}\n\n` +
      `Public cible: ${script.targetAudience}\n` +
      `Durée: ${script.duration}\n\n` +
      `Objectifs d'apprentissage:\n${script.learningObjectives.map(obj => `- ${obj}`).join('\n')}\n\n` +
      `Aperçu: ${script.overview}\n\n` +
      `SCRIPT:\n\n${formattedScript}` +
      (script.additionalNotes ? `Notes supplémentaires: ${script.additionalNotes}` : '');
    
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold">{script.title}</h2>
          <p className="text-muted-foreground">
            Pour {script.targetAudience} • {script.duration}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopyScript}
          className="flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copié
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copier
            </>
          )}
        </Button>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Objectifs d'apprentissage</h3>
        <ul className="list-disc pl-5 space-y-1">
          {script.learningObjectives.map((objective, index) => (
            <li key={index}>{objective}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Aperçu</h3>
        <p>{script.overview}</p>
      </div>

      <Tabs defaultValue="full" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="full">Script Complet</TabsTrigger>
          <TabsTrigger value="sections">Par Sections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="full" className="mt-4">
          <div className="space-y-6">
            {script.script.map((section, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-4 rounded-md",
                  index % 2 === 0 ? "bg-gray-50" : "bg-white border border-gray-200"
                )}
              >
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold">{section.section}</h4>
                  <span className="text-sm text-muted-foreground">{section.duration}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-semibold text-blue-600 mb-1">Narration</h5>
                    <p className="whitespace-pre-line">{section.narration}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-green-600 mb-1">Visuels</h5>
                    <p className="whitespace-pre-line">{section.visualNotes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sections" className="mt-4">
          <Tabs defaultValue={`section-0`} className="w-full">
            <TabsList className="w-full flex overflow-x-auto pb-2 hide-scrollbar">
              {script.script.map((section, index) => (
                <TabsTrigger 
                  key={index} 
                  value={`section-${index}`}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  {section.section}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {script.script.map((section, index) => (
              <TabsContent key={index} value={`section-${index}`} className="mt-4">
                <div className="p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between mb-4">
                    <h4 className="font-bold text-lg">{section.section}</h4>
                    <span className="text-muted-foreground">{section.duration}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-md">
                      <h5 className="text-sm font-semibold text-blue-600 mb-2">Narration</h5>
                      <p className="whitespace-pre-line">{section.narration}</p>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-md">
                      <h5 className="text-sm font-semibold text-green-600 mb-2">Visuels</h5>
                      <p className="whitespace-pre-line">{section.visualNotes}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>
      
      {script.additionalNotes && (
        <div className="mt-6 p-4 bg-amber-50 rounded-md">
          <h3 className="font-semibold text-amber-700 mb-2">Notes supplémentaires</h3>
          <p>{script.additionalNotes}</p>
        </div>
      )}
    </div>
  );
};
