import { motion } from "framer-motion";
import { ShieldIcon, PlaneIcon, ClockIcon, CheckIcon } from "./Icons";
import Reveal, { fadeUp, stagger } from "./motion/Reveal";

const items = [
  {
    icon: ShieldIcon,
    title: "Insurance included",
    text: "Every rental ships with the right cover so you can drive without worry.",
  },
  {
    icon: PlaneIcon,
    title: "Free airport delivery",
    text: "We meet you at Hato Airport with your car ready and paperwork done.",
  },
  {
    icon: ClockIcon,
    title: "24/7 roadside support",
    text: "A real person on the phone if anything happens during your trip.",
  },
  {
    icon: CheckIcon,
    title: "All in pricing",
    text: "What you see on the booking is what you pay. No hidden add ons.",
  },
];

export default function WhyUs() {
  return (
    <section className="section bg-cream-50">
      <div className="container-x">
        <Reveal className="max-w-2xl" variants={fadeUp}>
          <span className="eyebrow">Why choose us</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
            Renting a car should feel easy.
          </h2>
          <p className="mt-3 text-slate-600">
            We keep things simple so you can focus on the trip. Pick the car,
            tell us where to meet you, and drive off in a vehicle we are proud
            of.
          </p>
        </Reveal>
        <Reveal
          variants={stagger}
          className="mt-8 md:mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {items.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              className="card"
            >
              <div className="w-12 h-12 grid place-items-center rounded-xl bg-navy-900 text-gold-400">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
