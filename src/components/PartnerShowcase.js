"use client";

import { useLanguage } from "@/hooks/useLanguage";
import PartnerCard from "@/components/PartnerCard";

export default function PartnerShowcase({ partners }) {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">{t.products.title}</h1>

      {partners.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">{t.products.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              emptyLabel={t.products.noProductTypes}
              moreLabel={t.products.more}
            />
          ))}
        </div>
      )}
    </div>
  );
}
