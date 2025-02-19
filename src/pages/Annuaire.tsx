
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Check, X, Heart, Link as LinkIcon, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  usage: string | null;
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
      <div className="min-h-screen bg-zinc-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Annuaire des outils
            </h1>
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-red-500 text-center">Une erreur est survenue lors du chargement des outils.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Annuaire des outils
            </h1>
            <p className="text-xl text-zinc-600">
              Une sélection d'outils externes pour enrichir vos formations.
            </p>
          </div>

          <div className="space-y-16">
            {categories.map((category) => (
              <div key={category} className="scroll-m-20">
                <div className="sticky top-20 bg-zinc-50/80 backdrop-blur-sm z-10 py-4">
                  <h2 className="text-3xl font-bold mb-8 text-zinc-800">
                    {category}
                  </h2>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-zinc-200/80 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-zinc-50/50">
                        <TableHead className="w-[250px]">Nom</TableHead>
                        <TableHead className="w-[300px]">Usage</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead className="text-center">RGPD</TableHead>
                        <TableHead className="text-right">Lien</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tools
                        ?.filter((tool) => tool.category === category)
                        .map((tool) => (
                          <TableRow 
                            key={tool.id}
                            className="transition-colors hover:bg-zinc-50/50"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {tool.name}
                                {tool.favorite && (
                                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-zinc-600">
                              {tool.usage}
                            </TableCell>
                            <TableCell>
                              {tool.pricing_source ? (
                                <a
                                  href={tool.pricing_source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors group"
                                >
                                  {tool.pricing}
                                  <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                </a>
                              ) : (
                                <span className="text-zinc-600">{tool.pricing}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
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
                                    className="text-blue-600 hover:text-blue-700 transition-colors group inline-flex items-center gap-1"
                                  >
                                    <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                  </a>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <a
                                href={tool.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
                              >
                                <span className="group-hover:underline">Visiter</span>
                                <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Annuaire;
