import { getProducts, getOffers } from "@/lib/data";
import OffersManager from "@/components/admin/OffersManager";

export default async function AdminOffersPage() {
  const [products, offers] = await Promise.all([getProducts(), getOffers()]);

  return <OffersManager products={products} initialOffers={offers} />;
}
