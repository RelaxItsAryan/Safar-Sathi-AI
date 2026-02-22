import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";

const Index = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Navbar darkMode={darkMode} toggleDark={() => setDarkMode(!darkMode)} />
        <HeroSection />
        <FeaturesSection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
