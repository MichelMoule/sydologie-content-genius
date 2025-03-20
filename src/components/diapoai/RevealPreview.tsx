
import { useEffect, useRef, useState } from 'react';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';
import 'reveal.js/plugin/highlight/monokai.css';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RevealPreviewProps {
  slidesHtml: string;
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

const RevealPreview = ({ slidesHtml }: RevealPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState('white');
  const [transition, setTransition] = useState('slide');
  const [deck, setDeck] = useState<any>(null);
  
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
            (heading as HTMLElement).style.color = '#1B4D3E';
          });
          
          // Add subtle background to slide content
          if (!slide.classList.contains('has-dark-background')) {
            (slide as HTMLElement).style.background = 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(240,240,240,1) 100%)';
            (slide as HTMLElement).style.borderRadius = '4px';
            (slide as HTMLElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
          }
        });
        
        // Initialize Reveal.js
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
          plugins: [Highlight, Notes, Markdown, Zoom, Math]
        });
        
        await newDeck.initialize();
        setDeck(newDeck);
        console.log('Reveal.js initialized successfully');
      } catch (error) {
        console.error('Error initializing Reveal.js:', error);
      }
    };

    loadReveal();
  }, [slidesHtml]);

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
