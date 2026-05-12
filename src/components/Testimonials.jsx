import { motion } from "framer-motion";
import { StarIcon } from "./Icons";
import Reveal, { fadeUp, stagger } from "./motion/Reveal";

const reviews = [
  {
    name: "Marta R.",
    trip: "Visiting from the Netherlands",
    quote:
      "Super friendly team. The Kia Soul was perfect for our family and we got it delivered right at the airport. Booking was simple over WhatsApp.",
  },
  {
    name: "James K.",
    trip: "Business traveler",
    quote:
      "I rented for three weeks while working on the island. The price was fair, the car was clean, and they answered every message quickly.",
  },
  {
    name: "Sophie L.",
    trip: "Honeymoon trip",
    quote:
      "We had a small issue with a tire and they came out within the hour. That kind of service makes a real difference on vacation.",
  },
];

export default function Testimonials() {
  return (
    <section className="section">
      <div className="container-x">
        <Reveal className="max-w-2xl" variants={fadeUp}>
          <span className="eyebrow">Customer stories</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
            People love driving with us.
          </h2>
        </Reveal>
        <Reveal variants={stagger} className="mt-8 md:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {reviews.map((r) => (
            <motion.figure
              key={r.name}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="card"
            >
              <div className="flex gap-1 text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4" />
                ))}
              </div>
              <blockquote className="mt-4 text-slate-700 leading-relaxed">
                "{r.quote}"
              </blockquote>
              <figcaption className="mt-4 pt-4 border-t border-navy-100">
                <div className="font-semibold text-navy-900">{r.name}</div>
                <div className="text-xs text-slate-500">{r.trip}</div>
              </figcaption>
            </motion.figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
