import { getSettings } from "@/lib/data";
import { withPlaceholderFallback } from "@/lib/constants";
import Hero from "@/components/Hero";

export default async function HomePage() {
  const settings = withPlaceholderFallback(await getSettings());

  return <Hero settings={settings} />;
}
