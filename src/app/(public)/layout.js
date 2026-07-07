import { getSettings } from "@/lib/data";
import { withPlaceholderFallback } from "@/lib/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function PublicLayout({ children }) {
  const settings = withPlaceholderFallback(await getSettings());

  return (
    <>
      <Header companyName={settings.company_name} logoUrl={settings.logo_url} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
