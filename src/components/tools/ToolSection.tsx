
import ToolCard from "./ToolCard";

interface ToolSectionProps {
  title: string;
  tools: Array<{
    id: number;
    name: string;
    description: string;
    image: string;
    path?: string;
  }>;
}

const ToolSection = ({ title, tools }: ToolSectionProps) => {
  return (
    <section className="mb-16">
      <h3 className="text-2xl font-bold mb-8 font-dmsans">
        <span className="text-[#1F5E40]">_</span>{title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            id={tool.id}
            name={tool.name}
            description={tool.description}
            image={tool.image}
            path={tool.path}
          />
        ))}
      </div>
    </section>
  );
};

export default ToolSection;
