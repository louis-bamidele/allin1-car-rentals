import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal, { fadeUp, stagger } from "./motion/Reveal";

const faqs = [
  {
    q: "What is the minimum age to rent?",
    a: "The minimum age is 23. Please bring a valid driver's license and a passport or ID. No credit card is required.",
  },
  {
    q: "How does the security deposit work?",
    a: "We collect a $300 cash deposit at pickup. It is fully refunded at the end of the rental once the car is returned in the same condition.",
  },
  {
    q: "Is insurance included in the price?",
    a: "Third-party liability insurance is included with every rental. If you want full coverage, you can add All-Risk insurance for an extra charge at pickup.",
  },
  {
    q: "Do you deliver to the airport or my hotel?",
    a: "Yes. Delivery is free for rentals of 5 days or more. For shorter rentals there is a flat $15 delivery fee. Just send us your address or flight details and we will sort the rest.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept cash and bank transfers. We do not accept credit or debit card payments at this time.",
  },
  {
    q: "Is mileage limited? What extras are available?",
    a: "All rentals come with unlimited mileage so you can explore the whole island without worrying about the odometer. A child seat can be added for $10 per day.",
  },
  {
    q: "Do you offer weekly or monthly discounts?",
    a: "Yes. We have discounted rates for weekly and monthly rentals. The longer you stay, the better the rate. Contact us for an exact quote.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellations are charged 50% of the total rental amount. If you need to change your dates, reach out as early as possible and we will do our best to help.",
  },
  {
    q: "What happens if there is a breakdown or accident?",
    a: "In the event of an accident, call 9233 (local emergency) and notify us right away. A flat tire is the renter's responsibility, but you can always call us for advice and we will guide you through it.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section bg-cream-50">
      <div className="container-x grid lg:grid-cols-12 gap-8 lg:gap-10">
        <Reveal className="lg:col-span-4" variants={fadeUp}>
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
            Answers to common questions.
          </h2>
          <p className="mt-3 text-slate-600">
            Cannot find what you need? Send us a message on WhatsApp and we
            will get back to you the same day.
          </p>
        </Reveal>
        <Reveal variants={stagger} className="lg:col-span-8 space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              variants={fadeUp}
              className="rounded-2xl bg-white shadow-card overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
              >
                <span className="font-display font-semibold text-navy-900">
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0, backgroundColor: open === i ? "#D8A24A" : "#FAF6EE" }}
                  className="w-8 h-8 grid place-items-center rounded-full text-navy-900"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
