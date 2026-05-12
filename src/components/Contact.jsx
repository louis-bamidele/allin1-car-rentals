import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon, WhatsAppIcon } from "./Icons";

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container-x max-w-3xl mx-auto text-center">
        <span className="eyebrow">Contact</span>
        <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
          Get in touch with our team.
        </h2>
        <p className="mt-3 text-slate-600">
          WhatsApp is the fastest way to reach us. We reply every day and will
          get back to you the same day.
        </p>

        <a
          href="https://wa.me/59995178686"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold hover:opacity-90 transition text-base"
        >
          <WhatsAppIcon className="w-5 h-5" /> Send us a message on WhatsApp
        </a>

        <ul className="mt-10 grid sm:grid-cols-3 gap-6 text-left">
          <li className="flex items-start gap-3">
            <div className="w-10 h-10 grid place-items-center rounded-xl bg-navy-900 text-gold-400 shrink-0">
              <PhoneIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Phone and WhatsApp</div>
              <a href="tel:+59995178686" className="font-semibold text-navy-900">
                +5999 517 8686
              </a>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-10 h-10 grid place-items-center rounded-xl bg-navy-900 text-gold-400 shrink-0">
              <MapPinIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Location</div>
              <div className="font-semibold text-navy-900">
                Curaçao, island-wide delivery
              </div>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-10 h-10 grid place-items-center rounded-xl bg-navy-900 text-gold-400 shrink-0">
              <ClockIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Hours</div>
              <div className="font-semibold text-navy-900">
                Daily, 8:00 AM to 5:00 PM
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
