import Image from "next/image";
import { Package } from "lucide-react";

function formatPrice(price) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export default function ProductCard({ product }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="relative flex h-40 items-center justify-center bg-neutral-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <Package className="h-10 w-10 text-neutral-300" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold text-neutral-900">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-neutral-500 line-clamp-2">
            {product.description}
          </p>
        )}
        {product.price != null && (
          <p className="mt-auto pt-2 font-semibold text-orange-600">
            {formatPrice(product.price)} den
          </p>
        )}
      </div>
    </div>
  );
}
