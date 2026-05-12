import { motion } from "framer-motion";
import { PlaneIcon, ClockIcon, CarIcon, ShieldIcon, MapPinIcon, CheckIcon } from "./Icons";
import Reveal, { fadeUp, stagger } from "./motion/Reveal";

const services = [
  { icon: PlaneIcon, title: "Airport pickup", text: "Tell us your flight and we will meet you outside arrivals with your keys." },
  { icon: ClockIcon, title: "Long term rentals", text: "Weekly and monthly rates for stays of two weeks or more." },
  { icon: CarIcon, title: "Corporate accounts", text: "Simple billing and priority service for companies and crews on the island." },
  { icon: ShieldIcon, title: "Insurance options", text: "Standard cover is included. Upgrade if you want extra peace of mind." },
  { icon: MapPinIcon, title: "Hotel delivery", text: "We bring the car to your hotel or vacation rental at no extra cost." },
  { icon: CheckIcon, title: "Free cancellation", text: "Plans change. Cancel up to 24 hours before pickup with no fees." },
];

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container-x">
        <Reveal className="max-w-2xl" variants={fadeUp}>
          <span className="eyebrow">Services</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
            Built for travelers, locals, and businesses.
          </h2>
          <p className="mt-3 text-slate-600">
            Whether you need a car for a weekend on the beach or a month for
            work, we have a plan that fits.
          </p>
        </Reveal>
        <Reveal variants={stagger} className="mt-8 md:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="card flex gap-4"
            >
              <div className="shrink-0 w-12 h-12 grid place-items-center rounded-xl bg-cream-50 text-navy-900">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{text}</p>
              </div>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
