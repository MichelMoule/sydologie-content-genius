
import { LucideIcon } from "lucide-react";

export type Tool = {
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

export type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
};
