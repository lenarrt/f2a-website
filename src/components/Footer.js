"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { KURTISHI_SOLUTIONS_URL } from "@/lib/constants";
import ContactSection from "@/components/ContactSection";

export default function Footer({ settings }) {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer>
      <ContactSection settings={settings} />
      <div className="border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-neutral-500 sm:flex-row sm:px-6">
          <span>
            © {year} {settings.company_name}. {t.footer.rights}
          </span>
          <span>
            {t.footer.credit}{" "}
            <Link
              href={KURTISHI_SOLUTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-700 hover:text-orange-600"
            >
              Kurtishi Solutions
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
