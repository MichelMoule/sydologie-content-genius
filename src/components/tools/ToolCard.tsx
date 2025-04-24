
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface ToolCardProps {
  id: number;
  name: string;
  description: string;
  image: string;
  path?: string;
}

const ToolCard = ({ id, name, description, image, path }: ToolCardProps) => {
  // Check if the image is a URL/path or an icon name
  const isIconName = !image.startsWith('/') && !image.includes('.');
  
  // Render icon or image based on the type
  const renderImage = () => {
    if (isIconName) {
      // Dynamically get the icon component from Lucide
      const IconComponent = (LucideIcons as Record<string, LucideIcon>)[
        // Convert kebab-case to PascalCase for Lucide icon names
        image.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
      ];
      
      return IconComponent ? (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg mb-4">
          <IconComponent className="w-20 h-20 text-gray-600" />
        </div>
      ) : (
        <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-gray-500">Icon not found</span>
        </div>
      );
    }
    
    // Render as regular image
    return (
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
    );
  };

  return (
    <Link 
      key={id} 
      to={path || "#"} 
      className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      {renderImage()}
      <h4 className="text-xl font-bold mb-2 font-dmsans">
        <span className="text-[#1F5E40]">_</span>
        {name}
      </h4>
      <p className="text-gray-700 font-dmsans">{description}</p>
    </Link>
  );
};

export default ToolCard;
