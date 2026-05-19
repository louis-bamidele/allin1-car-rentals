import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingCTA from "./components/FloatingCTA";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import OurCars from "./pages/OurCars";
import CarDetails from "./pages/CarDetails";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <LanguageProvider>
      <div className="overflow-x-hidden">
        <ScrollToTop />
        <Navbar />
        <main>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<OurCars />} />
              <Route path="/car/:id" element={<CarDetails />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </AnimatePresence>
        </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <FloatingCTA />}
      </div>
    </LanguageProvider>
  );
}
