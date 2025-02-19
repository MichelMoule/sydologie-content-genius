
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
                <div key={n} className="h-48 bg-gray-200 rounded"></div>
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Annuaire des outils</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Une sélection d'outils externes pour enrichir vos formations.
        </p>

        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools
                ?.filter((tool) => tool.category === category)
                .map((tool) => (
                  <Card key={tool.id} className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {tool.name}
                            {tool.favorite && (
                              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            )}
                          </CardTitle>
                          <CardDescription>{tool.usage}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <a
                          href={tool.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors group"
                        >
                          <LinkIcon className="h-4 w-4" />
                          <span className="group-hover:underline">Visiter le site</span>
                          <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                        </a>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Prix:</span>
                          {tool.pricing_source ? (
                            <a
                              href={tool.pricing_source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors group"
                            >
                              {tool.pricing}
                              <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                            </a>
                          ) : (
                            <span>{tool.pricing}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">RGPD:</span>
                          <div className="flex items-center gap-2">
                            {tool.gdpr ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                            {tool.gdpr_source && (
                              <a
                                href={tool.gdpr_source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 transition-colors group inline-flex items-center gap-1"
                              >
                                <span className="group-hover:underline">Source</span>
                                <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
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
  );
};

export default Annuaire;
