
import { Link } from "react-router-dom";

interface ToolCardProps {
  id: number;
  name: string;
  description: string;
  image: string;
  path?: string;
  partnerLogo?: string;
}

const ToolCard = ({ id, name, description, image, path, partnerLogo }: ToolCardProps) => {
  return (
    <Link 
      key={id} 
      to={path || "#"} 
      className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="w-full h-48 rounded-lg mb-4 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      </div>
      <h4 className="text-xl font-bold mb-2 font-dmsans">
        <span className="text-[#1F5E40]">_</span>
        {name}
      </h4>
      <p className="text-gray-700 font-dmsans">{description}</p>
      
      {partnerLogo && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">Propulsé par</p>
          <img src={partnerLogo} alt="Partner logo" className="h-6" />
        </div>
      )}
    </Link>
  );
};

export default ToolCard;
