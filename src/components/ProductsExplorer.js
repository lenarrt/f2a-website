"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import ProductCard from "@/components/ProductCard";

export default function ProductsExplorer({ categories, products }) {
  const { t } = useLanguage();
  const [categoryId, setCategoryId] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        categoryId === "all" || product.category_id === categoryId;
      const matchesQuery = product.name
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, categoryId, query]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">{t.products.title}</h1>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryId("all")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              categoryId === "all"
                ? "bg-orange-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {t.products.allCategories}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryId(category.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                categoryId === category.id
                  ? "bg-orange-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.products.searchPlaceholder}
            className="w-full rounded-lg border border-neutral-300 py-2 pl-9 pr-3 text-sm focus:border-orange-600 focus:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">
          {categoryId === "all" ? t.products.emptyAll : t.products.empty}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
