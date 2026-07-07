import { getCategories, getProducts, getSettings } from "@/lib/data";
import { withPlaceholderFallback } from "@/lib/constants";
import ProductsExplorer from "@/components/ProductsExplorer";

export async function generateMetadata() {
  const settings = withPlaceholderFallback(await getSettings());
  return {
    title: `Produktet — ${settings.company_name}`,
    description: settings.tagline,
  };
}

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <ProductsExplorer categories={categories} products={products} />
    </div>
  );
}
