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

const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Home() {
  return (
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
  );
}
