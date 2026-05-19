import { useLang } from "../contexts/LanguageContext";

const LANGS = [
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "es", flag: "🇪🇸", label: "ES" },
  { code: "nl", flag: "🇳🇱", label: "NL" },
];

export default function LangSwitcher() {
  const { lang, switchLang } = useLang();
  return (
    <div className="flex items-center gap-1">
      {LANGS.map(({ code, flag, label }) => (
        <button
          key={code}
          onClick={() => switchLang(code)}
          className={`text-4xl leading-none transition-all duration-200 ${
            lang === code
              ? "opacity-100 scale-110"
              : "opacity-40 hover:opacity-75"
          }`}
          aria-label={label}
          title={label}
        >
          {flag}
        </button>
      ))}
    </div>
  );
}
