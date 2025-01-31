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
    <section className="w-full py-16 bg-[#AEADAD]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">
            <span className="text-[#00FF00]">_</span>Les dernières actualités{" "}
            <span className="text-[#00FF00]">autour de l'ia</span>
          </h2>
          <Button className="bg-[#00FF00] hover:bg-[#00DD00] text-black font-medium px-6 py-3">
            Voir plus d'actualités
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="flex flex-col">
              <div className="relative aspect-video mb-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute bottom-4 left-4 flex flex-col">
                  <span className="text-[#00FF00] font-bold">{article.category}</span>
                  <span className="text-white">{article.date}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                <span className="text-[#00FF00]">_</span>{article.title}
              </h3>
              <p className="text-gray-800">{article.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Actualites;