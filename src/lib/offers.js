// Resolves what to display for an offer regardless of whether it's linked
// to a partner product (pulls the name from there — partner products have
// no image) or standalone (uses its own title/image_url) — so the public
// site can render both identically.
export function resolveOfferDisplay(offer) {
  if (offer.partner_product_id) {
    return {
      title: offer.partner_product?.name ?? "",
      image_url: null,
    };
  }
  return {
    title: offer.title ?? "",
    image_url: offer.image_url ?? null,
  };
}
