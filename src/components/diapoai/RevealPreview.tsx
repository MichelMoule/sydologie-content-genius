
import { useEffect, useRef, useState } from 'react';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';
import 'reveal.js/plugin/highlight/monokai.css';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Download, PaintBucket } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RevealPreviewProps {
  slidesHtml: string;
  onExportPpt?: () => void;
  onColorChange?: (colors: ThemeColors) => void;
}

// Theme color interface
interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

// Available themes in reveal.js
const themes = [
  { name: 'White', value: 'white' },
  { name: 'Black', value: 'black' },
  { name: 'League', value: 'league' },
  { name: 'Beige', value: 'beige' },
  { name: 'Sky', value: 'sky' },
  { name: 'Night', value: 'night' },
  { name: 'Serif', value: 'serif' },
  { name: 'Simple', value: 'simple' },
  { name: 'Solarized', value: 'solarized' },
  { name: 'Blood', value: 'blood' },
  { name: 'Moon', value: 'moon' },
];

// Transition options
const transitions = [
  { name: 'None', value: 'none' },
  { name: 'Fade', value: 'fade' },
  { name: 'Slide', value: 'slide' },
  { name: 'Convex', value: 'convex' },
  { name: 'Concave', value: 'concave' },
  { name: 'Zoom', value: 'zoom' },
];

const RevealPreview = ({ slidesHtml, onExportPpt, onColorChange }: RevealPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState('white');
  const [transition, setTransition] = useState('slide');
  const [deck, setDeck] = useState<any>(null);
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    primary: "#1B4D3E",
    secondary: "#FF9B7A",
    background: "#FFFFFF",
    text: "#333333"
  });
  const { toast } = useToast();
  
  // Load theme CSS dynamically
  useEffect(() => {
    const linkId = 'reveal-theme-link';
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    link.href = `https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/theme/${theme}.css`;
    
    // Update Reveal.js configuration if it's already initialized
    if (deck) {
      deck.configure({ transition });
    }
  }, [theme, transition, deck]);

  // Dynamically load the plugins scripts
  useEffect(() => {
    const loadPluginsScripts = async () => {
      // Function to load a script
      const loadScript = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
          document.head.appendChild(script);
        });
      };

      try {
        // Load SVG.js required for the Animate plugin
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.min.js');
        
        // Load Chart.js required for the Chart plugin
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.2.0/chart.min.js');
        
        // Load the LoadContent plugin (required for Animate plugin)
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/loadcontent/plugin.js');
        
        // Load the Animate plugin
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/animate/plugin.js');
        
        // Load the Anything plugin
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/anything/plugin.js');
        
        // Load the Chart plugin
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chart/plugin.js');
        
        console.log('All plugins loaded successfully');
      } catch (error) {
        console.error('Error loading plugin scripts:', error);
      }
    };

    loadPluginsScripts();
  }, []);

  useEffect(() => {
    const loadReveal = async () => {
      if (!containerRef.current) return;

      try {
        // Dynamic import of Reveal.js
        const Reveal = (await import('reveal.js')).default;
        const Highlight = (await import('reveal.js/plugin/highlight/highlight')).default;
        const Notes = (await import('reveal.js/plugin/notes/notes')).default;
        const Markdown = (await import('reveal.js/plugin/markdown/markdown')).default;
        const Zoom = (await import('reveal.js/plugin/zoom/zoom')).default;
        const Math = (await import('reveal.js/plugin/math/math')).default;
        
        // Clear previous content
        containerRef.current.innerHTML = slidesHtml;
        
        // Add SYDO styling to slides
        const slides = containerRef.current.querySelectorAll('.slides section');
        slides.forEach(slide => {
          // Add SYDO color to headings
          const headings = slide.querySelectorAll('h1, h2, h3');
          headings.forEach(heading => {
            (heading as HTMLElement).style.color = themeColors.primary;
          });
          
          // Check for section title slides and add special styling
          if (slide.classList.contains('section-title')) {
            (slide as HTMLElement).style.background = `linear-gradient(135deg, ${themeColors.primary}15 0%, rgba(255,255,255,0.9) 100%)`;
            (slide as HTMLElement).style.borderRadius = '4px';
          }
          
          // Check for title slide and add special styling
          if (slide.classList.contains('title-slide')) {
            (slide as HTMLElement).style.background = 'linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)';
            (slide as HTMLElement).style.borderRadius = '4px';
          }
          
          // Add subtle background to regular slides
          if (!slide.classList.contains('has-dark-background') && 
              !slide.classList.contains('section-title') && 
              !slide.classList.contains('title-slide')) {
            (slide as HTMLElement).style.background = 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(240,240,240,1) 100%)';
            (slide as HTMLElement).style.borderRadius = '4px';
            (slide as HTMLElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
          }
        });
        
        // Check if the plugin globals are available
        const RevealLoadContent = (window as any).RevealLoadContent;
        const RevealAnimate = (window as any).RevealAnimate;
        const RevealAnything = (window as any).RevealAnything;
        const RevealChart = (window as any).RevealChart;

        // Collect available plugins
        const plugins = [Highlight, Notes, Markdown, Zoom, Math];
        
        // Add loaded plugins if they exist
        if (RevealLoadContent) plugins.push(RevealLoadContent);
        if (RevealAnimate) plugins.push(RevealAnimate);
        if (RevealAnything) plugins.push(RevealAnything);
        if (RevealChart) plugins.push(RevealChart);
        
        // Initialize Reveal.js with enhanced features and plugins
        const newDeck = new Reveal(containerRef.current, {
          embedded: true,
          margin: 0.1,
          height: 700,
          width: 960,
          controls: true,
          progress: true,
          center: true,
          hash: false,
          transition: transition,
          slideNumber: true,
          autoPlayMedia: true,
          autoAnimate: true, // Enable auto-animate
          backgroundTransition: 'fade',
          plugins: plugins,
          // Plugin specific configuration
          animate: {
            autoplay: true // Auto play animations
          },
          anything: {
            // Default config for anything plugin
          },
          chart: {
            defaults: {
              color: themeColors.text,
              scale: {
                beginAtZero: true,
                grid: { color: `${themeColors.primary}33` }
              },
            },
            line: { borderColor: [themeColors.primary, themeColors.secondary] },
            bar: { backgroundColor: [themeColors.primary, themeColors.secondary] },
            pie: { backgroundColor: [[themeColors.primary, themeColors.secondary, `${themeColors.primary}88`, `${themeColors.secondary}88`]] }
          }
        });
        
        await newDeck.initialize();
        setDeck(newDeck);
        console.log('Reveal.js initialized successfully with plugins');
      } catch (error) {
        console.error('Error initializing Reveal.js:', error);
      }
    };

    // Wait a brief moment to ensure plugins are loaded
    const timer = setTimeout(() => {
      loadReveal();
    }, 500);

    return () => clearTimeout(timer);
  }, [slidesHtml, themeColors]);

  const handleColorChange = (colorType: keyof ThemeColors, color: string) => {
    const newColors = { ...themeColors, [colorType]: color };
    setThemeColors(newColors);
    
    // Notify parent component if callback exists
    if (onColorChange) {
      onColorChange(newColors);
    }
    
    toast({
      title: "Couleurs mises à jour",
      description: "Les couleurs du diaporama ont été changées."
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              Thème
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {themes.map((t) => (
              <DropdownMenuItem 
                key={t.value}
                onClick={() => setTheme(t.value)}
                className="flex items-center justify-between"
              >
                {t.name}
                {theme === t.value && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              Transition
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {transitions.map((t) => (
              <DropdownMenuItem 
                key={t.value}
                onClick={() => setTransition(t.value)}
                className="flex items-center justify-between"
              >
                {t.name}
                {transition === t.value && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <PaintBucket className="mr-2 h-4 w-4" />
              Couleurs
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Personnalisation des couleurs</h4>
                <p className="text-sm text-muted-foreground">
                  Choisissez les couleurs de votre diaporama
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-2">
                  <Label htmlFor="primaryColor">Couleur principale</Label>
                  <div className="col-span-2 flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-md border" 
                      style={{ backgroundColor: themeColors.primary }}
                    />
                    <Input
                      id="primaryColor"
                      type="color"
                      value={themeColors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-2">
                  <Label htmlFor="secondaryColor">Couleur d'accent</Label>
                  <div className="col-span-2 flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-md border" 
                      style={{ backgroundColor: themeColors.secondary }}
                    />
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={themeColors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-2">
                  <Label htmlFor="textColor">Couleur du texte</Label>
                  <div className="col-span-2 flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-md border" 
                      style={{ backgroundColor: themeColors.text }}
                    />
                    <Input
                      id="textColor"
                      type="color"
                      value={themeColors.text}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-2">
                  <Label htmlFor="backgroundColor">Couleur de fond</Label>
                  <div className="col-span-2 flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-md border" 
                      style={{ backgroundColor: themeColors.background }}
                    />
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={themeColors.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {onExportPpt && (
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={onExportPpt}
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter PPT
          </Button>
        )}
      </div>
      
      <div 
        ref={containerRef} 
        className="reveal-container border rounded-lg overflow-hidden shadow-lg"
        style={{ height: '700px', width: '100%' }}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray-500">Chargement du diaporama...</p>
        </div>
      </div>
    </div>
  );
};

export default RevealPreview;
