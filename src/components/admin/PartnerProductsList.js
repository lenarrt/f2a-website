"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { createClient } from "@/lib/supabase/client";

export default function PartnerProductsList({ partnerId, initialProducts }) {
  const { t } = useLanguage();
  const [items, setItems] = useState(initialProducts);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const supabase = createClient();

  async function handleAdd(event) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;

    const sort_order = items.reduce((max, p) => Math.max(max, p.sort_order), -1) + 1;

    const { data } = await supabase
      .from("partner_products")
      .insert({ name, sort_order, partner_id: partnerId })
      .select()
      .single();

    if (data) {
      setItems((prev) => [...prev, data]);
      setNewName("");
    }
  }

  function startEditing(item) {
    setEditingId(item.id);
    setEditingName(item.name);
  }

  async function saveEditing(id) {
    const name = editingName.trim();
    setEditingId(null);
    if (!name) return;

    await supabase.from("partner_products").update({ name }).eq("id", id);
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  }

  async function handleDelete(id) {
    if (!window.confirm(t.admin.confirmDelete)) return;
    await supabase.from("partner_products").delete().eq("id", id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleMove(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const next = [...items];
    const [a, b] = [next[index], next[target]];
    [a.sort_order, b.sort_order] = [b.sort_order, a.sort_order];
    next[index] = b;
    next[target] = a;
    setItems(next);

    await Promise.all([
      supabase.from("partner_products").update({ sort_order: a.sort_order }).eq("id", a.id),
      supabase.from("partner_products").update({ sort_order: b.sort_order }).eq("id", b.id),
    ]);
  }

  return (
    <div className="space-y-3 border-t border-neutral-100 bg-neutral-50 p-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          required
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder={t.admin.name}
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-orange-600 focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-700"
        >
          <Plus className="h-3.5 w-3.5" />
          {t.admin.add}
        </button>
      </form>

      <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {items.map((item, index) => (
          <li key={item.id} className="flex items-center gap-2 px-3 py-2">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => handleMove(index, -1)}
                disabled={index === 0}
                className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                aria-label="Move up"
              >
                <ArrowUp className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(index, 1)}
                disabled={index === items.length - 1}
                className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                aria-label="Move down"
              >
                <ArrowDown className="h-3 w-3" />
              </button>
            </div>

            {editingId === item.id ? (
              <input
                autoFocus
                type="text"
                value={editingName}
                onChange={(event) => setEditingName(event.target.value)}
                onBlur={() => saveEditing(item.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveEditing(item.id);
                }}
                className="flex-1 rounded-lg border border-orange-400 px-2 py-1 text-sm focus:outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => startEditing(item)}
                className="flex-1 text-left text-sm text-neutral-900 hover:text-orange-600"
              >
                {item.name}
              </button>
            )}

            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="text-neutral-400 hover:text-red-600"
              aria-label={t.admin.delete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="px-3 py-4 text-center text-xs text-neutral-400">
            {t.admin.noProductTypesYet}
          </li>
        )}
      </ul>
    </div>
  );
}
