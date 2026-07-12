import { getPartners, getSettings } from "@/lib/data";
import { withPlaceholderFallback } from "@/lib/constants";
import PartnerShowcase from "@/components/PartnerShowcase";

export async function generateMetadata() {
  const settings = withPlaceholderFallback(await getSettings());
  return {
    title: `Produktet — ${settings.company_name}`,
    description: settings.tagline,
  };
}

export default async function ProductsPage() {
  const partners = await getPartners();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PartnerShowcase partners={partners} />
    </div>
  );
}
