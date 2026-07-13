import { motion } from "framer-motion";
import DestinationBanner from "../components/DestinationBanner";
import Hero from "../components/Hero";
import WhyUs from "../components/WhyUs";
import Fleet from "../components/Fleet";
import HowItWorks from "../components/HowItWorks";
import Services from "../components/Services";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";
import Seo from "../components/Seo";

const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Home() {
  return (
    <>
      <Seo
        title="Car Rental Curaçao | Free Airport Delivery from $35/day | All in 1"
        description="Rent a car in Curaçao from $35/day. Economy, comfort & SUV rentals with free Hato Airport delivery, unlimited mileage, and all-inclusive pricing. Locally owned, book on WhatsApp in minutes."
        path="/"
      />
      <motion.div variants={page} initial="initial" animate="animate" exit="exit">
        <DestinationBanner />
        <Hero />
        <WhyUs />
        <Fleet />
        <HowItWorks />
        <Services />
        <About />
        <Testimonials />
        <FAQ />
        <Contact />
      </motion.div>
    </>
  );
}
