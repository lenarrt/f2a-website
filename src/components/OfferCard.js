import Image from "next/image";
import { Tag } from "lucide-react";
import { resolveOfferDisplay } from "@/lib/offers";

export default function OfferCard({ offer }) {
  const { title, image_url } = resolveOfferDisplay(offer);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="relative flex h-40 items-center justify-center bg-neutral-100">
        {image_url ? (
          <Image src={image_url} alt={title} fill className="object-cover" />
        ) : (
          <Tag className="h-10 w-10 text-neutral-300" />
        )}
        {offer.offer_text && (
          <span className="absolute left-2 top-2 rounded-full bg-orange-600 px-2.5 py-1 text-xs font-semibold text-white">
            {offer.offer_text}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold text-neutral-900">{title}</h3>
        {offer.description && (
          <p className="text-sm text-neutral-500 line-clamp-2">{offer.description}</p>
        )}
      </div>
    </div>
  );
}
