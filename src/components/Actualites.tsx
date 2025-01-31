import { Button } from "./ui/button";

const articles = [
  {
    id: 1,
    category: "France",
    date: "31/03/2023",
    title: "Des experts appellent à une pause de 6 mois",
    image: "/lovable-uploads/1046881e-a488-400b-84ec-be790dc09009.png",
    description: "Ces dernières semaines, de nombreuses images de synthèse faisant écho à l'actualité ont interloqué - ou sidéré - sur les réseaux sociaux. Comme nous vous l'expliquions dans la vidéo (...)"
  },
  {
    id: 2,
    category: "International",
    date: "31/03/2023",
    title: "L'Italie bloque le robot conversationnel ChatGPT",
    image: "/lovable-uploads/eeca2560-d188-4aaa-b795-fb779564beb0.png",
    description: "L'Italie mène-t-elle la fronde contre l'intelligence artificielle ? Le pays a annoncé vendredi bloquer le robot conversationnel ChatGPT pour des craintes liées à l'utilisation des données, deux mois après avoir (...)"
  }
];

const Actualites = () => {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <h2 className="text-4xl font-bold mb-4 md:mb-0">
            <span className="text-[#00FF00]">_</span>Les dernières actualités{" "}
            <span className="text-[#00FF00]">autour de l'ia</span>
          </h2>
          <Button variant="ghost" className="text-black hover:text-[#00FF00] transition-colors">
            Voir plus d'actualités
          </Button>
        </div>
        
        <div className="flex flex-col space-y-8 max-w-5xl mx-auto">
          {articles.map((article) => (
            <div key={article.id} className="flex flex-col md:flex-row gap-6">
              <div className="relative md:w-1/2">
                <div className="absolute left-0 bottom-0 z-10 p-3 space-y-0.5">
                  <span className="text-[#00FF00] font-bold block text-sm">{article.category}</span>
                  <span className="text-white block text-xs">{article.date}</span>
                </div>
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full aspect-[16/9] object-cover rounded-lg"
                />
              </div>
              <div className="md:w-1/2 space-y-2">
                <h3 className="text-lg font-bold">
                  <span className="text-[#00FF00]">_</span>{article.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">{article.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Actualites;