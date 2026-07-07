"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Trash2, Pencil, Plus } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { createClient } from "@/lib/supabase/client";
import ProductForm from "@/components/admin/ProductForm";

export default function ProductsManager({ categories, initialProducts }) {
  const { t } = useLanguage();
  const [products, setProducts] = useState(initialProducts);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const supabase = createClient();
  const categoryName = (id) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  async function handleCreate(values) {
    const { data } = await supabase
      .from("products")
      .insert(values)
      .select()
      .single();

    if (data) {
      setProducts((prev) => [...prev, data]);
      setAdding(false);
    }
  }

  async function handleUpdate(id, values) {
    const { data } = await supabase
      .from("products")
      .update(values)
      .eq("id", id)
      .select()
      .single();

    if (data) {
      setProducts((prev) => prev.map((p) => (p.id === id ? data : p)));
      setEditingId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t.admin.confirmDelete)) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="max-w-3xl space-y-6">
      {adding ? (
        <ProductForm
          categories={categories}
          initialValues={{}}
          onSave={handleCreate}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" />
          {t.admin.add}
        </button>
      )}

      <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {products.map((product) =>
          editingId === product.id ? (
            <li key={product.id} className="p-4">
              <ProductForm
                categories={categories}
                initialValues={product}
                onSave={(values) => handleUpdate(product.id, values)}
                onCancel={() => setEditingId(null)}
              />
            </li>
          ) : (
            <li key={product.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-5 w-5 text-neutral-300" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">
                  {product.name}
                </p>
                <p className="truncate text-xs text-neutral-500">
                  {categoryName(product.category_id)}
                  {product.price != null && ` · ${product.price} €`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingId(product.id)}
                className="text-neutral-400 hover:text-orange-600"
                aria-label={t.admin.edit}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(product.id)}
                className="text-neutral-400 hover:text-red-600"
                aria-label={t.admin.delete}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          )
        )}
        {products.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-neutral-400">—</li>
        )}
      </ul>
    </div>
  );
}
