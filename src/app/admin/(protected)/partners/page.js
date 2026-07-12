import { getPartners } from "@/lib/data";
import PartnersManager from "@/components/admin/PartnersManager";

export default async function AdminPartnersPage() {
  const partners = await getPartners();

  return <PartnersManager initialPartners={partners} />;
}
