"use client";

import { useLanguage } from "@/hooks/useLanguage";
import OfferCard from "@/components/OfferCard";

export default function OffersSection({ offers }) {
  const { t } = useLanguage();

  if (!offers.length) return null;

  return (
    <section className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-xl font-bold text-neutral-900">{t.home.offersTitle}</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  );
}
