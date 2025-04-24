
import { Tool } from "@/types/tools";
import { tools } from "@/data/toolsList";

export const getToolsByCategory = (category: string) => {
  if (category === "all") {
    return tools.sort((a, b) => a.order - b.order);
  }
  return tools
    .filter((tool) => tool.category === category)
    .sort((a, b) => a.order - b.order);
};
