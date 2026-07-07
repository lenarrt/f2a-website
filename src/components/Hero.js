"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";

export default function Hero({ settings }) {
  const { t } = useLanguage();

  return (
    <section className="bg-neutral-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-24">
        {settings.logo_url ? (
          <Image
            src={settings.logo_url}
            alt={settings.company_name}
            width={96}
            height={96}
            className="h-24 w-24 rounded-lg object-contain bg-white p-2"
          />
        ) : (
          <span className="flex h-24 w-24 items-center justify-center rounded-lg bg-orange-600 text-4xl font-bold text-white">
            {settings.company_name?.[0] ?? "F"}
          </span>
        )}

        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          {settings.company_name}
        </h1>
        <p className="max-w-xl text-lg text-neutral-300">{settings.tagline}</p>
        {settings.description && (
          <p className="max-w-2xl text-sm text-neutral-400">
            {settings.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/products"
            className="rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700"
          >
            {t.home.heroCta}
          </Link>
          <Link
            href="/#contact"
            className="rounded-lg border border-neutral-600 px-6 py-3 text-sm font-semibold text-white hover:border-neutral-400"
          >
            {t.home.contactCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
