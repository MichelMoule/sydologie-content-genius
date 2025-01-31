import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Navbar from "@/components/Navbar";

interface Article {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl: string | null;
}

const fetchArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase.functions.invoke('get-rss-feed')
  if (error) throw error
  return data
}

const Actualites = () => {
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });

  if (error) {
    console.error('Error fetching articles:', error);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12">
          <span className="text-[#00FF00]">_</span>Actualités
        </h1>

        {isLoading ? (
          <div className="space-y-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Une erreur est survenue lors du chargement des articles.
          </div>
        ) : (
          <div className="space-y-8">
            {articles?.map((article, index) => (
              <a
                key={index}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Card className="overflow-hidden transition-transform duration-200 hover:scale-[1.02]">
                  <div className="flex flex-col md:flex-row gap-6">
                    {article.imageUrl && (
                      <div className="relative md:w-1/3">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="h-48 w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-6">
                      <CardTitle className="group-hover:text-[#00FF00] transition-colors mb-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="mb-4">
                        {article.pubDate && format(new Date(article.pubDate), 'dd MMMM yyyy', { locale: fr })}
                      </CardDescription>
                      <div 
                        className="text-muted-foreground line-clamp-3"
                        dangerouslySetInnerHTML={{ 
                          __html: article.description 
                        }} 
                      />
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Actualites;