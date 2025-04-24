
import {
  LayoutDashboard,
  BookText,
  ImageIcon,
  VideoIcon,
  FileCode2,
  BrainCircuit,
  Briefcase,
} from "lucide-react";
import { Category } from "@/types/tools";

export const categories: Category[] = [
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
