import { getSettings, getOffers } from "@/lib/data";
import { withPlaceholderFallback } from "@/lib/constants";
import Hero from "@/components/Hero";
import OffersSection from "@/components/OffersSection";

export default async function HomePage() {
  const settings = withPlaceholderFallback(await getSettings());
  const offers = settings.show_offers ? await getOffers() : [];

  return (
    <>
      <Hero settings={settings} />
      {settings.show_offers && <OffersSection offers={offers} />}
    </>
  );
}
