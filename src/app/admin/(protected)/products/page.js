import { getCategories, getProducts } from "@/lib/data";
import ProductsManager from "@/components/admin/ProductsManager";

export default async function AdminProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return <ProductsManager categories={categories} initialProducts={products} />;
}
