// Resolves what to display for an offer regardless of whether it's linked
// to a product (pulls name/image from there) or standalone (uses its own
// title/image_url) — so the public site can render both identically.
export function resolveOfferDisplay(offer) {
  if (offer.product_id) {
    return {
      title: offer.product?.name ?? "",
      image_url: offer.product?.image_url ?? null,
    };
  }
  return {
    title: offer.title ?? "",
    image_url: offer.image_url ?? null,
  };
}
