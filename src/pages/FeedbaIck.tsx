import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const FeedbaIck = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/outils" className="text-sydologie-green hover:underline mb-8 inline-block">
          &lt; Outils
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          {/* Left Column */}
          <div className="space-y-8">
            <h1 className="text-6xl font-bold text-sydologie-red">FEEDBAICK</h1>
            
            <h2 className="text-3xl font-bold leading-tight">
              Vous avez recu des centaines de retours suite à votre dernière formation et ne savez pas comment les traitez rapidement ?
            </h2>
            
            <p className="text-lg">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.
            </p>
            
            <p className="text-lg">
              Et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
            </p>
          </div>
          
          {/* Right Column - Will be used for the form/interface later */}
          <div className="bg-white rounded-lg shadow-xl p-12 min-h-[600px] md:col-span-1 lg:col-span-1">
            {/* Placeholder for future content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbaIck;