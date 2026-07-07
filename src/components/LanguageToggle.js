"use client";

import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-neutral-300 bg-white p-0.5 text-sm font-medium">
      {["sq", "en"].map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            language === lang
              ? "bg-orange-600 text-white"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
