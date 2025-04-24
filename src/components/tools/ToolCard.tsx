
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  id: number;
  name: string;
  description: string;
  image: string;
  path?: string;
}

const ToolCard = ({ id, name, description, image, path }: ToolCardProps) => {
  // Check if the image is a URL (starts with / or http)
  const isImageUrl = image.startsWith('/') || image.startsWith('http');
  
  return (
    <Link 
      key={id} 
      to={path || "#"} 
      className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      {isImageUrl ? (
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      ) : (
        <div className="w-full h-48 flex items-center justify-center rounded-lg mb-4 bg-gray-100">
          <span className="text-4xl">{image}</span>
        </div>
      )}
      <h4 className="text-xl font-bold mb-2 font-dmsans">
        <span className="text-[#1F5E40]">_</span>
        {name}
      </h4>
      <p className="text-gray-700 font-dmsans">{description}</p>
    </Link>
  );
};

export default ToolCard;
