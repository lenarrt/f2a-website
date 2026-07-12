import { getPartnerProducts, getOffers } from "@/lib/data";
import OffersManager from "@/components/admin/OffersManager";

export default async function AdminOffersPage() {
  const [partnerProducts, offers] = await Promise.all([getPartnerProducts(), getOffers()]);

  return <OffersManager partnerProducts={partnerProducts} initialOffers={offers} />;
}
