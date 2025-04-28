import {
  BrainCircuit,
  BookText,
  Briefcase,
  FileCode2,
  FileSearch,
  Flame,
  FolderKanban,
  GraduationCap,
  ImageIcon,
  LayoutDashboard,
  ListChecks,
  LucideIcon,
  MessageSquare,
  Pilcrow,
  Presentation,
  Search,
  Settings,
  Text,
  VideoIcon,
} from "lucide-react";

type Tool = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  link: string;
  bgColor: string;
  color: string;
  labelColor: string;
  featured: boolean;
  order: number;
  active: boolean;
};

export const categories = [
  {
    id: "all",
    name: "Tous",
    icon: LayoutDashboard,
  },
  {
    id: "text",
    name: "Textes",
    icon: BookText,
  },
  {
    id: "image",
    name: "Images",
    icon: ImageIcon,
  },
  {
    id: "video",
    name: "Vidéos",
    icon: VideoIcon,
  },
  {
    id: "code",
    name: "Code",
    icon: FileCode2,
  },
  {
    id: "ai",
    name: "IA",
    icon: BrainCircuit,
  },
  {
    id: "other",
    name: "Autres",
    icon: Briefcase,
  },
];

export const tools = [
  {
    id: "formations",
    name: "Formations",
    description: "Accédez à des formations de qualité",
    icon: "graduation-cap",
    category: "other",
    link: "/formations",
    bgColor: "bg-orange-50",
    color: "text-orange-600",
    labelColor: "orange",
    featured: true,
    order: 10,
    active: true,
  },
  {
    id: "feedbaick",
    name: "FeedbaIck",
    description: "Recevez des feedbacks constructifs",
    icon: "message-square",
    category: "text",
    link: "/outils/feedbaick",
    bgColor: "bg-red-50",
    color: "text-red-600",
    labelColor: "red",
    featured: true,
    order: 20,
    active: true,
  },
  {
    id: "quiz",
    name: "Quiz",
    description: "Testez vos connaissances",
    icon: "list-checks",
    category: "other",
    link: "/outils/quiz",
    bgColor: "bg-blue-50",
    color: "text-blue-600",
    labelColor: "blue",
    featured: true,
    order: 30,
    active: true,
  },
  {
    id: "program",
    name: "ProgrAImme",
    description: "Générez un programme de formation",
    icon: "pilcrow",
    category: "text",
    link: "/outils/program",
    bgColor: "bg-green-50",
    color: "text-green-600",
    labelColor: "green",
    featured: true,
    order: 40,
    active: true,
  },
  {
    id: "flashcards",
    name: "Flashcards",
    description: "Créez des flashcards pour mémoriser",
    icon: "file-search",
    category: "text",
    link: "/outils/flashcards",
    bgColor: "bg-yellow-50",
    color: "text-yellow-600",
    labelColor: "yellow",
    featured: true,
    order: 50,
    active: true,
  },
  {
    id: "diapoai",
    name: "DiapoAI",
    description: "Générez un diaporama",
    icon: "presentation",
    category: "ai",
    link: "/outils/diapoai",
    bgColor: "bg-purple-50",
    color: "text-purple-600",
    labelColor: "purple",
    featured: true,
    order: 60,
    active: true,
  },
  {
    id: "diagram",
    name: "DiagramAI",
    description: "Générez des schémas pédagogiques",
    icon: "image",
    category: "ai",
    link: "/outils/diagram",
    bgColor: "bg-indigo-50",
    color: "text-indigo-600",
    labelColor: "indigo",
    featured: true,
    order: 65,
    active: true,
  },
  {
    id: "prompt-engineer",
    name: "PromptEngineer",
    description: "Créer et améliorer vos prompts pour l'IA",
    icon: "text",
    category: "ai",
    link: "/outils/prompt-engineer",
    bgColor: "bg-blue-50",
    color: "text-blue-600",
    labelColor: "blue",
    featured: true,
    order: 70,
    active: true,
  },
  {
    id: "glossaire",
    name: "Glossaire IA",
    description: "Découvrez les termes clés de l'IA",
    icon: "search",
    category: "ai",
    link: "/outils/glossaire",
    bgColor: "bg-sky-50",
    color: "text-sky-600",
    labelColor: "sky",
    featured: false,
    order: 80,
    active: true,
  },
  {
    id: "videoscript",
    name: "VideoScript",
    description: "Générez un script de vidéo",
    icon: "video",
    category: "video",
    link: "/outils/videoscript",
    bgColor: "bg-teal-50",
    color: "text-teal-600",
    labelColor: "teal",
    featured: false,
    order: 90,
    active: true,
  },
  {
    id: "suggestions",
    name: "Suggestions IA",
    description: "Recevez des suggestions d'amélioration",
    icon: "flame",
    category: "ai",
    link: "/outils/suggestions",
    bgColor: "bg-pink-50",
    color: "text-pink-600",
    labelColor: "pink",
    featured: false,
    order: 100,
    active: true,
  },
];

export const getToolsByCategory = (category: string) => {
  if (category === "all") {
    return tools.sort((a, b) => a.order - b.order);
  }
  return tools
    .filter((tool) => tool.category === category)
    .sort((a, b) => a.order - b.order);
};
