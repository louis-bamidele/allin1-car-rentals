import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowIcon } from "../components/Icons";

const UPDATED = "May 15, 2026";

const TC = [
  { id: "eligibility", n: "01", label: "Rental Eligibility" },
  { id: "reservations", n: "02", label: "Reservations & Booking" },
  { id: "pricing", n: "03", label: "Pricing & Payment" },
  { id: "deposit", n: "04", label: "Security Deposit" },
  { id: "insurance", n: "05", label: "Insurance & Coverage" },
  { id: "mileage", n: "06", label: "Mileage & Fuel" },
  { id: "delivery", n: "07", label: "Delivery, Pickup & Return" },
  { id: "cancellation", n: "08", label: "Cancellation Policy" },
  { id: "vehicle-use", n: "09", label: "Vehicle Use & Restrictions" },
  { id: "accidents", n: "10", label: "Accidents & Breakdowns" },
  { id: "extras", n: "11", label: "Additional Equipment" },
  { id: "general", n: "12", label: "General Provisions" },
];

const PP = [
  { id: "pp-collect", n: "I", label: "Information We Collect" },
  { id: "pp-use", n: "II", label: "How We Use Your Information" },
  { id: "pp-sharing", n: "III", label: "Information Sharing" },
  { id: "pp-retention", n: "IV", label: "Data Retention & Security" },
  { id: "pp-rights", n: "V", label: "Your Rights" },
  { id: "pp-contact", n: "VI", label: "Contact Us" },
];

function Bullets({ items }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 text-[15px] text-slate-600 leading-relaxed"
        >
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Block({ id, n, title, children }) {
  return (
    <div
      id={id}
      className="scroll-mt-32 pb-9 border-b border-slate-100 last:border-0 last:pb-0"
    >
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-mono text-xs font-bold text-gold-500 tracking-widest shrink-0">
          {n}
        </span>
        <h2 className="text-xl font-display font-bold text-navy-900">
          {title}
        </h2>
      </div>
      <div className="space-y-3 pl-7">{children}</div>
    </div>
  );
}

function P({ children }) {
  return (
    <p className="text-[15px] text-slate-600 leading-relaxed">{children}</p>
  );
}

const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Terms() {
  return (
    <motion.div variants={page} initial="initial" animate="animate" exit="exit">
      {/* ── Header ─────────────────────────────────────────── */}
      <section className="pt-28 sm:pt-32 lg:pt-40 pb-14 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

        {/* SVG line drawing */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="tc-diag"
              x="0"
              y="0"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="30"
                x2="30"
                y2="0"
                stroke="white"
                strokeWidth="0.5"
                strokeOpacity="0.06"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tc-diag)" />
          <g stroke="white" strokeWidth="0.8" fill="none" strokeOpacity="0.06">
            <circle cx="0" cy="100%" r="180" />
            <circle cx="0" cy="100%" r="290" />
            <circle cx="0" cy="100%" r="400" />
          </g>
          <g stroke="white" strokeWidth="0.6" strokeOpacity="0.04">
            <line x1="40%" y1="0" x2="100%" y2="100%" />
            <line x1="55%" y1="0" x2="110%" y2="100%" />
          </g>
        </svg>

        <div className="container-x relative">
          <span className="eyebrow text-gold-400">Legal</span>
          <h1 className="mt-3 text-gold-400 text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight">
            Terms, Conditions
            <br className="block" />
            &amp; Privacy Policy
          </h1>
          <p className="mt-4 max-w-2xl text-white/70 text-sm sm:text-base leading-relaxed">
            Please read these terms carefully before renting a vehicle from All
            in 1 Car Rentals. By completing a rental with us, you agree to the
            conditions outlined below.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
            <span>Last updated: {UPDATED}</span>
            <span>·</span>
            <span>
              Applies to all rentals from All in 1 Car Rentals, Curaçao
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            <a
              href="#eligibility"
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white/80 hover:text-white px-4 py-2 rounded-full transition"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="#privacy"
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white/80 hover:text-white px-4 py-2 rounded-full transition"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </section>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="container-x py-14 lg:py-20 grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">
        {/* Sticky sidebar */}
        <aside className="hidden lg:block sticky top-32 space-y-4">
          <div className="bg-cream-50 rounded-2xl border border-navy-100 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy-900/40 mb-3">
              Terms &amp; Conditions
            </p>
            <nav className="space-y-0.5">
              {TC.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-gold-600 hover:bg-white transition group"
                >
                  <span className="font-mono font-bold text-gold-500 w-5 text-[11px] group-hover:text-gold-600">
                    {s.n}
                  </span>
                  {s.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-navy-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy-900/40 mb-3">
                Privacy Policy
              </p>
              <nav className="space-y-0.5">
                {PP.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-gold-600 hover:bg-white transition group"
                  >
                    <span className="font-mono font-bold text-gold-500 w-5 text-[11px] group-hover:text-gold-600">
                      {s.n}
                    </span>
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="bg-navy-900 rounded-2xl p-5 text-white">
            <p className="font-semibold text-sm">Have a question?</p>
            <p className="mt-1 text-white/60 text-xs leading-relaxed">
              Our team is available daily from 8:00 AM to 5:00 PM.
            </p>
            <a
              href="https://wa.me/59995178686"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-xs font-semibold transition"
            >
              Chat on WhatsApp <ArrowIcon className="w-3 h-3" />
            </a>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0">
          {/* ── T&C ── */}
          <div className="mb-10 pb-8 border-b-2 border-navy-900">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy-900">
              General Rental Terms &amp; Conditions
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Effective for all rentals from All in 1 Car Rentals, Curaçao.
            </p>
          </div>

          <div className="space-y-9">
            <Block id="eligibility" n="01" title="Rental Eligibility">
              <P>
                The minimum age to rent a vehicle from All in 1 Car Rentals is{" "}
                <strong>23 years</strong>. A valid driver's license must be
                presented at the time of vehicle collection.
              </P>
              <P>
                A valid driver's license from your country of residence is
                accepted. International visitors are welcome to rent with their
                home-country license. Visitors from countries where licenses are
                not issued in Latin characters may be required to carry an
                International Driving Permit (IDP) alongside their national
                license.
              </P>
              <P>
                Only drivers listed on the rental agreement at the time of
                signing are authorized to operate the vehicle. Allowing an
                unlisted person to drive is a breach of this agreement and
                immediately voids all insurance coverage.
              </P>
              <P>
                An <strong>additional driver</strong> may be added to the
                rental agreement at no extra charge, provided they hold a
                valid driver's license and meet the minimum age requirement.
                All additional drivers must be present at vehicle collection
                to sign the rental agreement.
              </P>
            </Block>

            <Block id="reservations" n="02" title="Reservations & Booking">
              <P>
                Reservations can be made via WhatsApp (+5999 517 8686), the
                booking form on our website, or by phone during business hours
                (daily, 8:00 AM–5:00 PM). A reservation is confirmed only once
                All in 1 Car Rentals sends a written or verbal confirmation.
              </P>
              <P>
                Please ensure all details (rental dates, pickup location, and
                any extras) are accurate at the time of booking. Changes to a
                confirmed reservation must be requested as early as possible and
                are subject to availability.
              </P>
              <P>
                All in 1 Car Rentals reserves the right to decline a reservation
                or offer an alternative vehicle if the requested model is
                unavailable. In the event of a substitution, a vehicle of equal
                or greater value will be provided at no additional charge.
              </P>
            </Block>

            <Block id="pricing" n="03" title="Pricing & Payment">
              <P>
                All rental rates are calculated per 24-hour period from the
                agreed collection time. The quoted daily rate covers the vehicle
                rental and statutory third-party liability insurance. Additional
                items (All-Risk coverage, child seats, etc.) are charged
                separately as agreed at booking.
              </P>
              <P>
                <strong>Accepted payment methods:</strong> cash (ANG or USD) and
                local bank transfer. A credit or debit card is not required.
              </P>
              <P>
                Discounted weekly and monthly rates are available. Please
                contact us directly for current long-term pricing. All rates are
                all-inclusive with no hidden surcharges or administration fees.
              </P>
              <P>
                A <strong>minimum rental period of 3 days</strong> applies.
                Rentals of fewer than 3 days are available at an increased
                daily rate.
              </P>
            </Block>

            <Block id="deposit" n="04" title="Security Deposit">
              <P>
                A refundable security deposit of{" "}
                <strong>$300 USD in cash</strong> is required at the time of
                vehicle collection before the keys are handed over.
              </P>
              <P>
                The deposit is returned in full at the end of the rental,
                provided the vehicle is returned on time, in the same condition
                as collected, with a full tank of fuel, and with no outstanding
                fines or unpaid charges.
              </P>
              <P>
                All in 1 Car Rentals reserves the right to deduct from the
                deposit any costs relating to: damage to the vehicle not covered
                by insurance, outstanding traffic or parking fines notified to
                us, refueling charges, cleaning fees, or late return fees. If
                costs exceed the deposit amount, the renter remains liable for
                the balance.
              </P>
            </Block>

            <Block id="insurance" n="05" title="Insurance & Coverage">
              <P>
                <strong>Third-party liability (WA) insurance</strong> is
                included in every rental as required by law in Curaçao. This
                coverage protects against damage or injury caused to third
                parties and their property.
              </P>
              <P>
                <strong>Optional All-Risk (CDW) coverage</strong> is available
                for an additional daily fee. Please contact our team for current
                rates. All-Risk coverage substantially reduces the renter's
                financial exposure in the event of accidental damage to the
                rental vehicle itself.
              </P>
              <P>
                Without All-Risk coverage, the renter bears full financial
                responsibility for any damage to or loss of the rental vehicle,
                up to its full repair or replacement value.
              </P>
              <P>
                All insurance coverage is automatically <strong>void</strong>{" "}
                under the following circumstances:
              </P>
              <Bullets
                items={[
                  "The vehicle was operated under the influence of alcohol, drugs, or any substance that impairs driving ability.",
                  "The vehicle was used for any purpose prohibited by this agreement (off-road, racing, towing, subleasing, etc.).",
                  "The accident or damage was not reported immediately to All in 1 Car Rentals and Curaçao Road Service (9233).",
                  "The driver left the scene of an accident without following the required reporting procedure.",
                  "The vehicle was operated by a person not listed as an authorized driver on the rental agreement.",
                ]}
              />
            </Block>

            <Block id="mileage" n="06" title="Mileage & Fuel">
              <P>
                All rentals include <strong>unlimited mileage</strong>. There
                are no per-kilometre charges or mileage caps.
              </P>
              <P>
                Vehicles are provided with a <strong>full tank of fuel</strong>{" "}
                and must be returned with a full tank. If the vehicle is
                returned with less fuel than it was collected with, the full
                cost of the missing fuel will be deducted from the security
                deposit.
              </P>
              <P>
                We recommend refueling shortly before returning the vehicle and
                retaining the receipt as proof of a full tank.
              </P>
            </Block>

            <Block id="delivery" n="07" title="Delivery, Pickup & Return">
              <P>
                <strong>Free delivery and collection</strong> is included for
                rentals of <strong>5 days or more</strong>.
              </P>
              <P>
                For rentals of fewer than 5 days, a delivery/collection fee of{" "}
                <strong>$15 USD</strong> applies per trip.
              </P>
              <P>
                We deliver and collect at Hato International Airport (CUR),
                hotels, resorts, and private addresses across Curaçao. Please
                specify your preferred location when booking.
              </P>
              <P>
                Vehicles must be returned at the agreed time and location.
                Returns more than <strong>6 hours</strong> past the agreed
                time will be charged a full additional day's rental fee.
                Returns within 6 hours of the agreed time are generally free
                of charge when you notify us in advance. Please contact us
                as soon as possible if you expect a late return.
              </P>
              <P>
                The vehicle will be inspected by our team at the point of
                collection and again at return. Any new damage discovered at
                return will be documented and handled in accordance with the
                insurance and deposit terms.
              </P>
            </Block>

            <Block id="cancellation" n="08" title="Cancellation Policy">
              <P>
                Cancellations of a confirmed reservation incur a{" "}
                <strong>
                  cancellation fee of 50% of the total booking value
                </strong>
                .
              </P>
              <P>
                To cancel, please contact All in 1 Car Rentals directly via
                WhatsApp or phone. The cancellation is recorded from the moment
                we confirm receipt of your request.
              </P>
              <P>
                In the event of a <strong>no-show</strong> (where the vehicle
                is not collected and no prior cancellation is communicated), the
                full booking amount may be charged.
              </P>
              <P>
                If All in 1 Car Rentals must cancel a confirmed reservation
                (e.g., due to force majeure or vehicle unavailability beyond our
                control), the renter will receive a full refund or an
                alternative vehicle of equal or greater value.
              </P>
            </Block>

            <Block id="vehicle-use" n="09" title="Vehicle Use & Restrictions">
              <P>
                Rental vehicles may only be operated on{" "}
                <strong>paved public roads within the island of Curaçao</strong>
                . Driving on unpaved tracks, beaches, riverbeds, or off-road
                terrain is strictly prohibited.
              </P>
              <P>
                <strong>All vehicles are non-smoking.</strong> Evidence of
                smoking inside the vehicle (odor, ash, or burn marks) will
                result in a professional cleaning fee of{" "}
                <strong>$150 USD</strong>, charged against the security deposit.
              </P>
              <P>
                <strong>Pets are permitted</strong> in the vehicle provided
                they are kept in an enclosed carrier at all times. If the
                vehicle is returned with pet-related soiling, odor, or damage
                requiring professional cleaning, a cleaning fee of{" "}
                <strong>$150 USD</strong> will be charged against the security
                deposit.
              </P>
              <P>
                The renter is personally responsible for all traffic violations,
                speeding fines, parking penalties, and toll charges incurred
                during the rental period. Where such charges are billed to All
                in 1 Car Rentals, the full amount plus an administration fee
                will be recovered from the renter.
              </P>
              <P>
                The following uses are strictly prohibited and immediately void
                all insurance coverage:
              </P>
              <Bullets
                items={[
                  "Taking the vehicle off the island of Curaçao.",
                  "Use in any form of racing, rallying, or competitive event.",
                  "Towing, pushing, or hauling any other vehicle or load.",
                  "Commercial transportation of passengers for hire (e.g., acting as a taxi or rideshare driver).",
                  "Carrying more passengers than the vehicle's stated seating capacity.",
                  "Subleasing, lending, or transferring the rental to any third party.",
                ]}
              />
            </Block>

            <Block
              id="accidents"
              n="10"
              title="Accidents, Breakdowns & Incidents"
            >
              <P>
                <strong>
                  In the event of an accident, follow these steps:
                </strong>
              </P>
              <Bullets
                items={[
                  "Ensure the safety of all persons involved. Call emergency services (911) if there are any injuries.",
                  "Do not move the vehicle unless it is creating a hazard.",
                  "Immediately call Curaçao Road Service (9233) and notify All in 1 Car Rentals at +5999 517 8686.",
                  "Do not admit fault, accept liability, or make any payments to other parties without prior approval from All in 1 Car Rentals.",
                  "Collect the full name, contact details, and license plate number of all parties involved, plus any witness details.",
                  "Photograph the scene, all vehicles involved, and all visible damage before anything is moved.",
                  "Obtain a copy of the police report if law enforcement attends the scene.",
                ]}
              />
              <P>
                <strong>In the event of a breakdown:</strong> call Curaçao Road
                Service (9233) and notify All in 1 Car Rentals immediately. Do
                not arrange or authorize repairs independently without our prior
                written approval.
              </P>
              <P>
                Failure to follow the above reporting procedure may result in
                the loss of insurance coverage, with the renter bearing the full
                cost of any resulting damage or liability.
              </P>
            </Block>

            <Block id="extras" n="11" title="Additional Equipment">
              <P>
                A <strong>child seat</strong> is available for rent at{" "}
                <strong>$10 USD per day</strong>, subject to availability. Child
                seats must be requested at the time of booking.
              </P>
              <P>
                The renter is responsible for the safe and correct installation
                and use of any additional equipment provided. All in 1 Car
                Rentals accepts no liability for personal injury resulting from
                the improper use of additional equipment.
              </P>
              <P>
                All additional equipment must be returned in its original
                condition. Damage to or loss of additional equipment will be
                charged at the full replacement value.
              </P>
            </Block>

            <Block id="general" n="12" title="General Provisions">
              <P>
                These terms and conditions form the entire agreement between the
                renter and All in 1 Car Rentals and supersede all prior
                representations, negotiations, and communications.
              </P>
              <P>
                By taking possession of a rental vehicle, the renter confirms
                that they have read, understood, and agreed to these terms and
                conditions in full.
              </P>
              <P>
                All in 1 Car Rentals reserves the right to amend these terms at
                any time. The version in force at the date of the original
                booking confirmation applies to that rental.
              </P>
              <P>
                These terms are governed by the laws of Curaçao, Kingdom of the
                Netherlands. Any disputes that cannot be resolved amicably shall
                be subject to the jurisdiction of the competent courts of
                Curaçao.
              </P>
              <P>
                If any individual provision of these terms is found to be
                invalid or unenforceable, the remaining provisions continue in
                full force and effect.
              </P>
            </Block>
          </div>

          {/* ── Privacy Policy ── */}
          <div id="privacy" className="scroll-mt-32 mt-20">
            <div className="rounded-2xl bg-navy-900 text-white p-7 sm:p-9 relative overflow-hidden">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="pp-grid"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <line
                      x1="0"
                      y1="24"
                      x2="24"
                      y2="0"
                      stroke="white"
                      strokeWidth="0.4"
                      strokeOpacity="0.07"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pp-grid)" />
                <circle
                  cx="100%"
                  cy="0"
                  r="220"
                  stroke="white"
                  strokeWidth="0.7"
                  fill="none"
                  strokeOpacity="0.07"
                />
                <circle
                  cx="100%"
                  cy="0"
                  r="340"
                  stroke="white"
                  strokeWidth="0.7"
                  fill="none"
                  strokeOpacity="0.07"
                />
              </svg>
              <div className="relative">
                <span className="eyebrow text-gold-400">Legal</span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-display font-bold">
                  Privacy Policy
                </h2>
                <p className="mt-2 text-white/60 text-sm leading-relaxed max-w-xl">
                  How All in 1 Car Rentals collects, uses, and protects your
                  personal information.
                </p>
                <p className="mt-3 text-white/30 text-xs">
                  Last updated: {UPDATED}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-9">
            <Block id="pp-collect" n="I" title="Information We Collect">
              <P>
                When you make a reservation or send an enquiry to All in 1 Car
                Rentals, we may collect the following personal information:
              </P>
              <Bullets
                items={[
                  "Full name",
                  "Phone number (WhatsApp and/or regular phone)",
                  "Email address (if provided)",
                  "Driver's license details",
                  "Rental dates and vehicle preference",
                  "Delivery or pickup address",
                ]}
              />
              <P>
                We do not collect, store, or process credit card or financial
                payment data.
              </P>
            </Block>

            <Block id="pp-use" n="II" title="How We Use Your Information">
              <P>Information you provide is used solely to:</P>
              <Bullets
                items={[
                  "Confirm and manage your rental booking.",
                  "Communicate with you regarding your reservation: availability, delivery details, confirmations, and reminders.",
                  "Prepare the rental agreement and issue payment receipts.",
                  "Handle post-rental matters such as damage assessment or lost property.",
                  "Comply with legal and regulatory obligations applicable under the laws of Curaçao.",
                ]}
              />
              <P>
                We will not contact you for unsolicited marketing purposes
                without your explicit prior consent.
              </P>
            </Block>

            <Block id="pp-sharing" n="III" title="Information Sharing">
              <P>
                All in 1 Car Rentals does not sell, trade, lease, or rent your
                personal information to any third party under any circumstances.
              </P>
              <P>
                Your information may be shared only in the following limited
                situations:
              </P>
              <Bullets
                items={[
                  "With our insurance provider, solely when required to process an insurance claim arising from your rental.",
                  "With law enforcement or government authorities, when required by applicable law (e.g., in connection with a traffic violation, accident report, or court order).",
                  "With our roadside assistance partner (9233), when coordinating breakdown or accident recovery on your behalf.",
                ]}
              />
            </Block>

            <Block id="pp-retention" n="IV" title="Data Retention & Security">
              <P>
                We retain your personal information for as long as reasonably
                necessary to fulfill the purposes described in this policy, and
                to comply with applicable legal and accounting requirements.
                Rental records are typically retained for a period of five (5)
                years following the end of the rental, in accordance with
                Curaçao commercial and tax regulations.
              </P>
              <P>
                We take appropriate technical and organizational measures to
                protect your personal information from unauthorized access,
                disclosure, alteration, or destruction. Access to personal data
                is limited to authorized personnel only.
              </P>
            </Block>

            <Block id="pp-rights" n="V" title="Your Rights">
              <P>Subject to applicable law, you have the right to:</P>
              <Bullets
                items={[
                  "Request access to the personal information we hold about you.",
                  "Request correction of any inaccurate or incomplete information.",
                  "Request deletion of your personal data, subject to any legal retention obligations that apply.",
                  "Object to or request restriction of certain processing of your data.",
                ]}
              />
              <P>
                To exercise any of these rights, please contact us using the
                details in the section below. We aim to respond to all data
                requests within a reasonable timeframe.
              </P>
            </Block>

            <Block id="pp-contact" n="VI" title="Contact Us">
              <P>
                For questions about these terms, the privacy policy, or your
                personal data, please reach out:
              </P>
              <div className="mt-4 bg-cream-50 rounded-2xl border border-navy-100 p-5 space-y-1.5">
                <p className="text-sm font-bold text-navy-900">
                  All in 1 Car Rentals
                </p>
                <p className="text-sm text-slate-600">
                  Curaçao, Kingdom of the Netherlands
                </p>
                <p className="text-sm text-slate-600">
                  Phone / WhatsApp:{" "}
                  <a
                    href="tel:+59995178686"
                    className="text-gold-600 hover:underline font-medium"
                  >
                    +5999 517 8686
                  </a>
                </p>
                <p className="text-sm text-slate-600">
                  Hours: Daily, 8:00 AM – 5:00 PM
                </p>
              </div>
              <P>We aim to respond to all enquiries within one business day.</P>
            </Block>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <Link to="/cars" className="btn-primary">
              Browse the fleet <ArrowIcon className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/59995178686"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              Ask us a question
            </a>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
