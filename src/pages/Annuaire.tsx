
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Check, X, Heart } from "lucide-react";

interface Tool {
  category: string;
  name: string;
  website: string;
  pricing: string;
  pricingSource?: string;
  gdpr: boolean;
  gdprSource?: string;
  favorite: boolean;
  usage: string;
}

const tools: Tool[] = [
  {
    category: "Génération de texte",
    name: "Claude",
    website: "https://claude.ai/",
    pricing: "Freemium 18€/mois",
    pricingSource: "https://www.anthropic.com/pricing",
    gdpr: false,
    gdprSource: "https://support.anthropic.com/fr/articles/7996881-quelle-est-votre-approche-concernant-le-rgpd-ou-les-questions-connexes",
    favorite: true,
    usage: "Génération texte et + / prompts"
  },
  {
    category: "Génération de texte",
    name: "ChatGPT",
    website: "https://chatgpt.com/",
    pricing: "Freemium 18€/mois",
    pricingSource: "https://openai.com/chatgpt/",
    gdpr: false,
    gdprSource: "https://www.lemonde.fr/pixels/article/2024/04/29/nouvelle-plainte-contre-openai-pour-infraction-au-rgpd_6230572_4408996.html",
    favorite: false,
    usage: "Génération texte et + / prompts"
  },
  {
    category: "Présentation",
    name: "Gamma",
    website: "https://gamma.app/",
    pricing: "Freemium 10€/mois",
    pricingSource: "https://gamma.app/pricing",
    gdpr: false,
    favorite: true,
    usage: "Support de présentation"
  },
  {
    category: "E-learning",
    name: "Autrice",
    website: "https://autrice.ai/",
    pricing: "960€/an",
    pricingSource: "https://autrice.ai/#offer-section",
    gdpr: true,
    gdprSource: "https://www.smartch.fr/mentionslegales",
    favorite: true,
    usage: "Création de contenus e-learnings"
  },
  {
    category: "E-learning",
    name: "Nolej",
    website: "https://nolej.io/",
    pricing: "2500 à 4500€/an",
    pricingSource: "https://nolej.io/contact-sales",
    gdpr: true,
    gdprSource: "https://nolej.io/legal",
    favorite: false,
    usage: "Création de contenus e-learnings"
  },
  {
    category: "Vidéo",
    name: "Runway",
    website: "https://app.runwayml.com/",
    pricing: "76$/mois",
    pricingSource: "https://runwayml.com/pricing",
    gdpr: false,
    gdprSource: "https://runwayml.com/privacy-policy",
    favorite: false,
    usage: "Vidéo - teaser"
  },
  {
    category: "Vidéo",
    name: "Lumen5",
    website: "https://lumen5.com/",
    pricing: "59$/mois",
    pricingSource: "https://lumen5.com/special-pricing/",
    gdpr: true,
    gdprSource: "https://help.lumen5.com/en/article/gdpr-compliance-1yoybf4/",
    favorite: true,
    usage: "Vidéo - contenu péda"
  },
  {
    category: "Vidéo",
    name: "Heygen",
    website: "https://www.heygen.com/",
    pricing: "65€/mois",
    pricingSource: "https://www.heygen.com/pricing",
    gdpr: true,
    gdprSource: "https://www.heygen.com/gdpr-commitment",
    favorite: true,
    usage: "Vidéo - avatar / doublage"
  },
  {
    category: "Images",
    name: "Leonardo",
    website: "https://app.leonardo.ai/",
    pricing: "Freemium 10€/mois",
    pricingSource: "https://app.leonardo.ai/buy",
    gdpr: true,
    gdprSource: "https://leonardo.ai/privacy-policy/",
    favorite: false,
    usage: "Génération d'images"
  },
  {
    category: "Images",
    name: "Seelab",
    website: "https://app.seelab.ai/",
    pricing: "Freemium 29€/mois",
    pricingSource: "https://app.seelab.ai/pricing",
    gdpr: true,
    favorite: false,
    usage: "Génération d'images"
  },
  {
    category: "Images",
    name: "Ideogram",
    website: "https://ideogram.ai/",
    pricing: "Freemium 8€/mois",
    pricingSource: "https://docs.ideogram.ai/plans-and-pricing/plans-and-pricing",
    gdpr: false,
    gdprSource: "https://about.ideogram.ai/legal/privacy",
    favorite: true,
    usage: "Génération d'images"
  },
  {
    category: "Transcription",
    name: "Whisper",
    website: "https://huggingface.co/spaces/Xenova/whisper-web",
    pricing: "OpenSource",
    pricingSource: "https://openai.com/index/whisper/",
    gdpr: true,
    favorite: true,
    usage: "Retranscription texte d'une vidéo ou d'un audio"
  },
  {
    category: "Collaboration",
    name: "Sana",
    website: "https://sana.ai/",
    pricing: "Freemium",
    pricingSource: "https://sana.ai/",
    gdpr: true,
    gdprSource: "https://help.sana.ai/en/articles/153270-sana-s-security-and-infrastructure-setup",
    favorite: true,
    usage: "Captation visios + retranscription + résumé + plan d'actions"
  },
  {
    category: "Chatbot",
    name: "GPT",
    website: "https://chatgpt.com/",
    pricing: "18€/mois",
    pricingSource: "https://openai.com/chatgpt/",
    gdpr: false,
    gdprSource: "https://www.lemonde.fr/pixels/article/2024/04/29/nouvelle-plainte-contre-openai-pour-infraction-au-rgpd_6230572_4408996.html",
    favorite: false,
    usage: "Chatbot"
  },
  {
    category: "Chatbot",
    name: "Chatbase",
    website: "https://www.chatbase.co/",
    pricing: "19€/mois",
    pricingSource: "https://www.chatbase.co/pricing",
    gdpr: true,
    favorite: true,
    usage: "Chatbot"
  },
  {
    category: "Chatbot",
    name: "Poe",
    website: "https://poe.com/",
    pricing: "Freemium",
    pricingSource: "https://poe.com/",
    gdpr: false,
    gdprSource: "https://poe.com/privacy",
    favorite: false,
    usage: "Chatbot"
  },
  {
    category: "Recherche",
    name: "Perplexity",
    website: "https://www.perplexity.ai/",
    pricing: "Freemium",
    pricingSource: "https://docs.perplexity.ai/guides/pricing",
    gdpr: true,
    gdprSource: "https://www.perplexity.ai/hub/legal/perplexity-api-terms-of-service",
    favorite: false,
    usage: "Recherche documentaire - web"
  },
  {
    category: "Recherche",
    name: "Consensus",
    website: "https://consensus.app/",
    pricing: "Freemium",
    pricingSource: "https://consensus.app/pricing/",
    gdpr: false,
    favorite: true,
    usage: "Recherche documentaire - articles scientifiques"
  },
  {
    category: "BD",
    name: "Dashtoon",
    website: "https://dashtoon.com/",
    pricing: "Freemium",
    pricingSource: "https://dashtoon.com/",
    gdpr: false,
    gdprSource: "https://dashtoon.com/privacy-policy",
    favorite: false,
    usage: "Création de BD"
  },
  {
    category: "Audio",
    name: "ElevenLabs",
    website: "https://elevenlabs.io/",
    pricing: "5$/mois",
    pricingSource: "https://elevenlabs.io/pricing",
    gdpr: true,
    gdprSource: "https://elevenlabs.io/warsaw-event-gdpr-notice",
    favorite: false,
    usage: "Génération de voix"
  },
  {
    category: "Audio",
    name: "WonderCraft",
    website: "https://www.wondercraft.ai/",
    pricing: "29$/mois",
    pricingSource: "https://www.wondercraft.ai/pricing",
    gdpr: true,
    gdprSource: "https://support.wondercraft.ai/articles/263907-privacy-policy",
    favorite: true,
    usage: "Création de podcast"
  }
];

const Annuaire = () => {
  const categories = Array.from(new Set(tools.map(tool => tool.category)));

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
                .filter((tool) => tool.category === category)
                .map((tool) => (
                  <Card key={tool.name} className="h-full">
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
                        <div>
                          <a
                            href={tool.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline break-all"
                          >
                            {tool.website}
                          </a>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Prix:</span>
                          {tool.pricingSource ? (
                            <a
                              href={tool.pricingSource}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {tool.pricing}
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
                            {tool.gdprSource && (
                              <a
                                href={tool.gdprSource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline text-sm"
                              >
                                Source
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
