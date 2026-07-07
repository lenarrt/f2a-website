"use client";

import { createContext, useContext, useEffect, useState } from "react";
import translations from "@/lib/translations";

const LanguageContext = createContext(null);
const STORAGE_KEY = "f2a-language";

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("sq");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "sq" || stored === "en") {
      setLanguage(stored);
    }
  }, []);

  function changeLanguage(next) {
    setLanguage(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  const value = {
    language,
    setLanguage: changeLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguageContext must be used within a LanguageProvider");
  }
  return context;
}
