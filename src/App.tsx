
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Formations from "./pages/Formations";
import Outils from "./pages/Outils";
import FeedbaIck from "./pages/FeedbaIck";
import Quiz from "./pages/Quiz";
import Program from "./pages/Program";
import Flashcards from "./pages/Flashcards";
import VideoScript from "./pages/VideoScript";
import NotFound from "./pages/NotFound";
import Annuaire from "./pages/Annuaire";
import Glossaire from "./pages/Glossaire";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/outils" element={<Outils />} />
          <Route path="/annuaire" element={<Annuaire />} />
          <Route path="/outils/feedbaick" element={<FeedbaIck />} />
          <Route path="/outils/quiz" element={<Quiz />} />
          <Route path="/outils/program" element={<Program />} />
          <Route path="/outils/flashcards" element={<Flashcards />} />
          <Route path="/outils/glossaire" element={<Glossaire />} />
          <Route path="/outils/videoscript" element={<VideoScript />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
