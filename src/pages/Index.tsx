
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#EDE8E0] font-dmsans overflow-hidden flex flex-col">
      <Navbar />
      <Hero />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
