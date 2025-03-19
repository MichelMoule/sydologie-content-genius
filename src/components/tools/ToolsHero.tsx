
import { Link } from "react-router-dom";
import { LightbulbIcon } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const ToolsHero = () => {
  const { t } = useLanguage();
  
  return <section className="container mx-auto px-4 py-24">
      <div className="flex gap-8">
        <div className="w-1/6">
          <h1 className="text-[#1F5E40] font-bold translate-y-20 whitespace-nowrap font-sans text-4xl"></h1>
        </div>
        <div className="w-5/6">
          <h2 className="text-4xl font-bold mb-8 font-dmsans">{t("tools.hero.title")}</h2>
          <p className="text-2xl mb-4 font-dmsans">
            <Link to="/contact" className="text-[#1F5E40] hover:underline">
              {t("tools.hero.contactUs")}
            </Link>{" "}
            {t("tools.hero.customTools")}
          </p>
          <div className="mt-6 flex items-center bg-gray-100 p-4 rounded-lg">
            <div className="mr-4 bg-[#1F5E40]/20 p-3 rounded-full">
              <LightbulbIcon className="h-6 w-6 text-[#1F5E40]" />
            </div>
            <div className="font-dmsans">
              <p className="font-bold">{t("tools.hero.ideaTitle")}</p>
              <p className="text-gray-600">{t("tools.hero.ideaDescription")}</p>
            </div>
            <Link to="/outils/suggestions" className="ml-auto bg-[#1F5E40] text-white px-4 py-2 rounded-md hover:bg-[#1F5E40]/90 whitespace-nowrap font-dmsans">
              {t("tools.hero.viewSuggestions")}
            </Link>
          </div>
        </div>
      </div>
    </section>;
};
export default ToolsHero;
