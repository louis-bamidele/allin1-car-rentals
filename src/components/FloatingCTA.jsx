import { WhatsAppIcon } from "./Icons";
import { useLang } from "../contexts/LanguageContext";

export default function FloatingCTA() {
  const { t } = useLang();
  return (
    <a
      href="https://wa.me/59995178686"
      target="_blank"
      rel="noreferrer"
      aria-label={t.floatingCta.ariaLabel}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-white font-semibold shadow-cta hover:scale-105 transition"
    >
      <WhatsAppIcon className="w-5 h-5" />
      <span className="hidden sm:inline">{t.floatingCta.label}</span>
    </a>
  );
}
