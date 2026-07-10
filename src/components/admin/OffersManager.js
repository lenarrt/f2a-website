"use client";

import { useState } from "react";
import Image from "next/image";
import { Tag, Trash2, Pencil, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { createClient } from "@/lib/supabase/client";
import { resolveOfferDisplay } from "@/lib/offers";
import OfferForm from "@/components/admin/OfferForm";

export default function OffersManager({ products, initialOffers }) {
  const { t } = useLanguage();
  const [offers, setOffers] = useState(initialOffers);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const supabase = createClient();
  const OFFER_SELECT = "*, product:products(name, image_url)";

  async function handleCreate(values) {
    const { data, error } = await supabase
      .from("offers")
      .insert(values)
      .select(OFFER_SELECT)
      .single();
    if (error) throw error;
    setOffers((prev) => [...prev, data]);
    setAdding(false);
  }

  async function handleUpdate(id, values) {
    const { data, error } = await supabase
      .from("offers")
      .update(values)
      .eq("id", id)
      .select(OFFER_SELECT)
      .single();
    if (error) throw error;
    setOffers((prev) => prev.map((o) => (o.id === id ? data : o)));
    setEditingId(null);
  }

  async function handleDelete(id) {
    if (!window.confirm(t.admin.confirmDelete)) return;
    await supabase.from("offers").delete().eq("id", id);
    setOffers((prev) => prev.filter((o) => o.id !== id));
  }

  async function handleMove(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= offers.length) return;

    const next = [...offers];
    const [a, b] = [next[index], next[target]];
    [a.sort_order, b.sort_order] = [b.sort_order, a.sort_order];
    next[index] = b;
    next[target] = a;
    setOffers(next);

    await Promise.all([
      supabase.from("offers").update({ sort_order: a.sort_order }).eq("id", a.id),
      supabase.from("offers").update({ sort_order: b.sort_order }).eq("id", b.id),
    ]);
  }

  return (
    <div className="max-w-3xl space-y-6">
      {adding ? (
        <OfferForm
          products={products}
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
        {offers.map((offer, index) =>
          editingId === offer.id ? (
            <li key={offer.id} className="p-4">
              <OfferForm
                products={products}
                initialValues={offer}
                onSave={(values) => handleUpdate(offer.id, values)}
                onCancel={() => setEditingId(null)}
              />
            </li>
          ) : (
            <li key={offer.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0}
                  className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 1)}
                  disabled={index === offers.length - 1}
                  className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {(() => {
                const display = resolveOfferDisplay(offer);
                return (
                  <>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
                      {display.image_url ? (
                        <Image
                          src={display.image_url}
                          alt=""
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Tag className="h-5 w-5 text-neutral-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900">
                        {display.title}
                      </p>
                      <p className="truncate text-xs text-neutral-500">
                        {offer.product_id ? t.admin.linkToProduct : t.admin.standalone}
                        {offer.offer_text && ` · ${offer.offer_text}`}
                      </p>
                    </div>
                  </>
                );
              })()}

              <button
                type="button"
                onClick={() => setEditingId(offer.id)}
                className="text-neutral-400 hover:text-orange-600"
                aria-label={t.admin.edit}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(offer.id)}
                className="text-neutral-400 hover:text-red-600"
                aria-label={t.admin.delete}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          )
        )}
        {offers.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-neutral-400">—</li>
        )}
      </ul>
    </div>
  );
}
