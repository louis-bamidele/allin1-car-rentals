import { useLang } from "../contexts/LanguageContext";

const LANGS = [
  { code: "es", flag: "🇪🇸" },
  { code: "nl", flag: "🇳🇱" },
];

export default function LangSwitcher() {
  const { lang, switchLang } = useLang();
  return (
    <div className="flex items-center gap-1">
      {LANGS.map(({ code, flag }) => (
        <button
          key={code}
          onClick={() => switchLang(lang === code ? "en" : code)}
          className={`text-lg leading-none transition ${lang === code ? "opacity-100 scale-110" : "opacity-50 hover:opacity-80"}`}
          aria-label={code.toUpperCase()}
        >
          {flag}
        </button>
      ))}
    </div>
  );
}
