"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageToggle from "@/components/LanguageToggle";

export default function Header({ companyName, logoUrl }) {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/products", label: t.nav.products },
    { href: "/#contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={companyName}
              width={40}
              height={40}
              className="h-10 w-10 rounded object-contain"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded bg-orange-600 text-lg font-bold text-white">
              {companyName?.[0] ?? "F"}
            </span>
          )}
          <span className="text-lg font-bold text-neutral-900">
            {companyName}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-700 hover:text-orange-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:block">
          <LanguageToggle />
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded border border-neutral-300 sm:hidden"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="text-xl leading-none">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-3 border-t border-neutral-200 bg-white px-4 py-4 sm:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-neutral-700 hover:text-orange-600"
            >
              {link.label}
            </Link>
          ))}
          <LanguageToggle />
        </nav>
      )}
    </header>
  );
}
