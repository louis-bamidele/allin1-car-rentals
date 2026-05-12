import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingCTA from "./components/FloatingCTA";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import OurCars from "./pages/OurCars";
import CarDetails from "./pages/CarDetails";

export default function App() {
  const location = useLocation();
  return (
    <div className="overflow-x-hidden">
      <ScrollToTop />
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<OurCars />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
