import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12">
          <span className="text-[#00FF00]">_</span>Actualités
        </h1>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles?.map((article, index) => (
              <a
                key={index}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full overflow-hidden transition-transform duration-200 hover:scale-[1.02]">
                  {article.imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="group-hover:text-[#00FF00] transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription>
                      {article.pubDate && format(new Date(article.pubDate), 'dd MMMM yyyy', { locale: fr })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="text-muted-foreground line-clamp-3"
                      dangerouslySetInnerHTML={{ 
                        __html: article.description 
                      }} 
                    />
                  </CardContent>
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