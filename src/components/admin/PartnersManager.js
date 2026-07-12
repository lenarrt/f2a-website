"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Building2,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { createClient } from "@/lib/supabase/client";
import ImageUploadField from "@/components/admin/ImageUploadField";
import PartnerProductsList from "@/components/admin/PartnerProductsList";

export default function PartnersManager({ initialPartners }) {
  const { t } = useLanguage();
  const [partners, setPartners] = useState(initialPartners);
  const [newName, setNewName] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const supabase = createClient();

  async function handleAdd(event) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;

    const sort_order = partners.reduce((max, p) => Math.max(max, p.sort_order), -1) + 1;

    const { data } = await supabase
      .from("partners")
      .insert({ name, logo_url: newLogoUrl, sort_order })
      .select()
      .single();

    if (data) {
      setPartners((prev) => [...prev, { ...data, partner_products: [] }]);
      setNewName("");
      setNewLogoUrl(null);
    }
  }

  function startEditing(partner) {
    setEditingId(partner.id);
    setEditingName(partner.name);
  }

  async function saveEditing(id) {
    const name = editingName.trim();
    setEditingId(null);
    if (!name) return;

    await supabase.from("partners").update({ name }).eq("id", id);
    setPartners((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  }

  async function updateLogo(id, logoUrl) {
    await supabase.from("partners").update({ logo_url: logoUrl }).eq("id", id);
    setPartners((prev) => prev.map((p) => (p.id === id ? { ...p, logo_url: logoUrl } : p)));
  }

  async function handleDelete(id) {
    if (!window.confirm(t.admin.confirmDelete)) return;
    await supabase.from("partners").delete().eq("id", id);
    setPartners((prev) => prev.filter((p) => p.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  async function handleMove(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= partners.length) return;

    const next = [...partners];
    const [a, b] = [next[index], next[target]];
    [a.sort_order, b.sort_order] = [b.sort_order, a.sort_order];
    next[index] = b;
    next[target] = a;
    setPartners(next);

    await Promise.all([
      supabase.from("partners").update({ sort_order: a.sort_order }).eq("id", a.id),
      supabase.from("partners").update({ sort_order: b.sort_order }).eq("id", b.id),
    ]);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-end gap-3 rounded-lg border border-orange-200 bg-orange-50/40 p-4"
      >
        <ImageUploadField bucket="products" value={newLogoUrl} onChange={setNewLogoUrl} />
        <input
          type="text"
          required
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder={t.admin.name}
          className="min-w-[10rem] flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" />
          {t.admin.add}
        </button>
      </form>

      <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {partners.map((partner, index) => {
          const expanded = expandedId === partner.id;
          return (
            <li key={partner.id}>
              <div className="flex items-center gap-3 px-4 py-3">
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
                    disabled={index === partners.length - 1}
                    className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
                  {partner.logo_url ? (
                    <Image
                      src={partner.logo_url}
                      alt=""
                      width={40}
                      height={40}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Building2 className="h-5 w-5 text-neutral-300" />
                  )}
                </div>

                {editingId === partner.id ? (
                  <input
                    autoFocus
                    type="text"
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    onBlur={() => saveEditing(partner.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") saveEditing(partner.id);
                    }}
                    className="flex-1 rounded-lg border border-orange-400 px-2 py-1 text-sm focus:outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => startEditing(partner)}
                    className="flex-1 text-left text-sm font-medium text-neutral-900 hover:text-orange-600"
                  >
                    {partner.name}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : partner.id)}
                  className="flex items-center gap-1 rounded-lg border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                >
                  {expanded ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                  {t.admin.productTypes}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(partner.id)}
                  className="text-neutral-400 hover:text-red-600"
                  aria-label={t.admin.delete}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {expanded && (
                <>
                  <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-3">
                    <ImageUploadField
                      bucket="products"
                      value={partner.logo_url}
                      onChange={(url) => updateLogo(partner.id, url)}
                      label={t.admin.logo}
                    />
                  </div>
                  <PartnerProductsList
                    partnerId={partner.id}
                    initialProducts={partner.partner_products}
                  />
                </>
              )}
            </li>
          );
        })}
        {partners.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-neutral-400">—</li>
        )}
      </ul>
    </div>
  );
}
