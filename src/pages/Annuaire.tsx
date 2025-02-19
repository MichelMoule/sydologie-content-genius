
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Check, X, Heart, Link as LinkIcon, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Tool {
  id: string;
  category: string;
  name: string;
  website: string;
  pricing: string;
  pricing_source: string | null;
  gdpr: boolean;
  gdpr_source: string | null;
  favorite: boolean;
  usage: string;
}

const fetchTools = async () => {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('category');
  
  if (error) throw error;
  return data as Tool[];
};

const Annuaire = () => {
  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: fetchTools,
  });

  const categories = Array.from(new Set(tools?.map(tool => tool.category) || []));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">Annuaire des outils</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-48 bg-gray-200 rounded-xl shadow-md"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-red-500">Une erreur est survenue lors du chargement des outils.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Annuaire des outils
          </h1>
          <p className="text-xl text-zinc-600">
            Une sélection d'outils externes pour enrichir vos formations.
          </p>
        </div>

        <div className="space-y-20">
          {categories.map((category) => (
            <div key={category} className="scroll-m-20">
              <div className="sticky top-20 bg-zinc-50/80 backdrop-blur-sm z-10 py-4">
                <h2 className="text-3xl font-bold mb-8 text-zinc-800">
                  {category}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools
                  ?.filter((tool) => tool.category === category)
                  .map((tool) => (
                    <Card 
                      key={tool.id} 
                      className="relative h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/50 backdrop-blur-sm border-zinc-200/80"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-zinc-900">
                              {tool.name}
                              {tool.favorite && (
                                <Heart className="h-5 w-5 fill-red-500 text-red-500 animate-pulse" />
                              )}
                            </CardTitle>
                            <CardDescription className="text-zinc-600 mt-2">
                              {tool.usage}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <a
                            href={tool.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group p-2 rounded-lg hover:bg-blue-50"
                          >
                            <LinkIcon className="h-4 w-4" />
                            <span className="group-hover:underline">Visiter le site</span>
                            <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </a>
                          <div className="flex items-center justify-between p-2">
                            <span className="font-medium text-zinc-700">Prix:</span>
                            {tool.pricing_source ? (
                              <a
                                href={tool.pricing_source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors group"
                              >
                                {tool.pricing}
                                <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                              </a>
                            ) : (
                              <span className="text-zinc-600">{tool.pricing}</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between p-2 bg-zinc-50 rounded-lg">
                            <span className="font-medium text-zinc-700">RGPD:</span>
                            <div className="flex items-center gap-2">
                              {tool.gdpr ? (
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                  <Check className="h-4 w-4" />
                                  <span className="text-sm font-medium">Compatible</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                  <X className="h-4 w-4" />
                                  <span className="text-sm font-medium">Non compatible</span>
                                </div>
                              )}
                              {tool.gdpr_source && (
                                <a
                                  href={tool.gdpr_source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 transition-colors group inline-flex items-center gap-1 text-sm"
                                >
                                  <span className="group-hover:underline">Source</span>
                                  <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Annuaire;
