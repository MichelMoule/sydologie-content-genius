
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Incontournables from "@/components/Incontournables";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#EDE8E0] font-dmsans overflow-x-hidden flex flex-col">
      <Navbar />
      <Hero />
      <div className="bg-white">
        <Incontournables />
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
