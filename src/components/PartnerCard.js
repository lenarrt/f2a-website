"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";

const VISIBLE_LIMIT = 10;
const BOTTOM_THRESHOLD = 4;

export default function PartnerCard({ partner, emptyLabel }) {
  const products = partner.partner_products ?? [];
  const isTruncated = products.length > VISIBLE_LIMIT;
  const [atBottom, setAtBottom] = useState(false);

  function handleScroll(event) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    setAtBottom(scrollTop + clientHeight >= scrollHeight - BOTTOM_THRESHOLD);
  }

  return (
    <div className="flex flex-col items-center rounded-lg border border-neutral-200 bg-white p-5 text-center">
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
        {partner.logo_url ? (
          <Image
            src={partner.logo_url}
            alt={partner.name}
            width={80}
            height={80}
            className="h-full w-full object-contain"
          />
        ) : (
          <Building2 className="h-8 w-8 text-neutral-300" />
        )}
      </div>
      <span className="mt-3 font-semibold text-neutral-900">{partner.name}</span>

      <div className="mt-4 w-full border-t border-neutral-100 pt-4">
        {products.length === 0 ? (
          <p className="text-sm text-neutral-400">{emptyLabel}</p>
        ) : (
          <div className="relative">
            <ul
              onScroll={isTruncated ? handleScroll : undefined}
              className="always-scrollbar max-h-64 space-y-1.5 overflow-y-auto pr-1 text-sm text-neutral-600"
            >
              {products.map((product) => (
                <li key={product.id}>{product.name}</li>
              ))}
            </ul>
            {isTruncated && !atBottom && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
