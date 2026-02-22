
import Navbar from "./pages/navbar";
import HeroSection from "./pages/HeroSection";
import "./App.css";

function App() {
  return (
    <>
      <div className="navbar">

      <Navbar />
      </div>
      {/* ...other app content... */}
      <HeroSection />
    </>
  );
}

export default App;
