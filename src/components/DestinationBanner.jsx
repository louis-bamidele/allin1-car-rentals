import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Reveal, { fadeUp } from "./motion/Reveal";
import { ArrowIcon } from "./Icons";

const ease = [0.22, 1, 0.36, 1];

export default function DestinationBanner() {
  return (
    <section className="relative overflow-hidden bg-navy-950 h-screen">
      {/* Background — landscape photo */}
      <motion.img
        src="/images/curacao-wide.jpg?v=2"
        alt="Willemstad waterfront, Curaçao"
        className="absolute inset-0 w-full h-full object-cover object-center"
        fetchPriority="high"
        decoding="async"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/50 to-navy-950/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-navy-950/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-start items-center pb-10 sm:pb-14 lg:pb-16 pt-24 sm:pt-28 lg:pt-32">
        <div className="container-x grid lg:grid-cols-[1fr_auto] items-end gap-8">
          {/* Text */}
          <Reveal variants={fadeUp} className="max-w-xl ">
            <h2 className="mt-2 text-navy/75 text-4xl lg:text-5xl font-display font-bold leading-tight">
              One island,{" "}
              <span className="text-gold-400">every road waiting.</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base max-w-lg pr-10 lg:pr-20 ">
              <span className="text-navy   bg-white/55 [box-decoration-break:clone] [-webkit-box-decoration-break:clone] px-1.5 py-0.5 rounded-md leading-relaxed">
                From the colorful streets of Willemstad to the wild west coast,
                the whole island is yours to discover. Whether you're here for a
                week or a month, explore it all at your own pace with a clean,
                reliable rental car.
              </span>
            </p>
            <Link
              to="/cars"
              className="mt-6 inline-flex bg-gold-400 items-center shadow-lg gap-2.5 px-6 py-3 rounded-full  text-navy font-semibold text-sm hover:bg-navy transition duration-300"
            >
              Book now <ArrowIcon className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
