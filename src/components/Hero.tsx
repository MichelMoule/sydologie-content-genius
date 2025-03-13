
import { Button } from "./ui/button";
const Hero = () => {
  return <div className="container mx-auto px-4 py-20 pb-32 bg-[#EDE8E0]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-8 relative">
        {/* Decorative SVG positioned to the left */}
        <div className="hidden lg:block absolute left-0 top-0 h-full" style={{
        transform: 'translateX(-70%)'
      }}>
          <svg width="261" height="433" viewBox="0 0 261 433" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60.0237 32.1618C77.7459 9.75233 86.607 -1.45242 95.7538 0.998446C104.901 3.44931 106.972 17.5835 111.115 45.8518L113.304 60.785C115.517 75.8835 116.623 83.4328 122.083 86.9801C127.542 90.5275 134.885 88.4683 149.571 84.3498L164.096 80.2765C191.592 72.5658 205.339 68.7104 211.297 76.0741C217.256 83.4378 210.629 96.0946 197.376 121.408L190.376 134.781C183.297 148.301 179.758 155.061 182.09 161.143C184.422 167.225 191.57 169.878 205.866 175.184L220.006 180.431C246.772 190.364 260.156 195.331 260.649 204.795C261.143 214.258 248.35 220.603 222.763 233.293L209.247 239.997C195.581 246.775 188.748 250.164 187.061 256.458C185.375 262.751 189.598 269.103 198.044 281.806L206.398 294.369C222.212 318.153 230.118 330.044 224.959 337.993C219.8 345.942 205.726 343.552 177.579 338.771L162.71 336.246C147.676 333.692 140.159 332.415 135.099 336.517C130.038 340.618 129.723 348.242 129.093 363.49L128.47 378.572C127.29 407.12 126.7 421.394 117.859 424.793C109.017 428.191 99.0387 417.978 79.0822 397.552L68.5399 386.762C57.8808 375.853 52.5513 370.398 46.0496 370.74C39.5478 371.083 34.815 377.067 25.3493 389.037L15.9872 400.875C-1.73502 423.284 -10.5962 434.489 -19.7429 432.038C-28.8897 429.587 -30.9613 415.453 -35.1044 387.185L-37.2931 372.252C-39.506 357.153 -40.6125 349.604 -46.072 346.056C-51.5315 342.509 -58.8744 344.568 -73.5602 348.687L-88.0851 352.76C-115.581 360.471 -129.328 364.326 -135.287 356.962C-141.245 349.599 -134.618 336.942 -121.366 311.628L-114.365 298.256C-107.286 284.736 -103.747 277.976 -106.079 271.893C-108.411 265.811 -115.559 263.159 -129.855 257.853L-143.995 252.606C-170.762 242.672 -184.145 237.706 -184.638 228.242C-185.132 218.778 -172.339 212.433 -146.752 199.743L-133.236 193.039C-119.57 186.262 -112.737 182.873 -111.05 176.579C-109.364 170.285 -113.587 163.934 -122.033 151.231L-130.387 138.667C-146.201 114.884 -154.107 102.992 -148.948 95.0434C-143.789 87.0943 -129.715 89.4847 -101.568 94.2655L-86.6988 96.791C-71.6651 99.3445 -64.1482 100.621 -59.0876 96.5199C-54.0271 92.4186 -53.7121 84.7945 -53.082 69.5463L-52.4588 54.4651C-51.2792 25.9164 -50.6894 11.6421 -41.8477 8.24406C-33.006 4.84598 -23.0278 15.0587 -3.07127 35.4842L7.47104 46.2743C18.1301 57.1838 23.4596 62.6386 29.9613 62.2962C36.4631 61.9539 41.1959 55.9692 50.6616 44L60.0237 32.1618Z" fill="#DDEEE4" />
          </svg>
        </div>

        <div className="md:w-3/5 pt-20">
          <div className="text-[#82C8A0] mb-4 text-sm uppercase tracking-wide font-medium">
            BIENVENUE SUR SYDOLOGIE.AI
          </div>
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold mb-4 leading-tight font-unbounded">
            Découvrez nos outils utilisant{" "}
            <span className="text-[#82C8A0]">l'intelligence artificielle</span>{" "}
            au service de vos formations
          </h1>
          
          <div className="mt-20 md:hidden">
            <p className="text-gray-600 mb-6 text-base">
              Nous sommes fiers de relancer Sydologie.ai suite à la demande des utilisateurs. Et le meilleur ? Tout est <strong>RGPD</strong> !
            </p>
            <div className="space-y-4 flex flex-col">
              <Button className="bg-[#82C8A0] text-white hover:bg-[#82C8A0]/90 py-3 px-5 rounded-full text-base flex items-center gap-2 w-full md:w-auto">
                M'inscrire gratuitement
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 12H4.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <Button variant="outline" className="border-[#82C8A0] text-[#82C8A0] hover:bg-[#82C8A0]/10 py-3 px-5 rounded-full text-base w-full md:w-auto">
                Me connecter
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/5 hidden md:block">
          <div className="pt-28">
            <p className="text-gray-500 mb-6 text-base">
              Nous sommes fiers de relancer Sydologie.ai suite à la demande des utilisateurs. Et le meilleur ? Tout est <strong>RGPD</strong> !
            </p>
            <div className="space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
              <Button className="bg-[#82C8A0] text-white hover:bg-[#82C8A0]/90 py-3 px-5 rounded-full text-base flex items-center gap-2">
                M'inscrire gratuitement
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 12H4.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <Button variant="outline" className="border-[#82C8A0] text-[#82C8A0] hover:bg-[#82C8A0]/10 py-3 px-5 rounded-full text-base">
                Me connecter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Hero;
