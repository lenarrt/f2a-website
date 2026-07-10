"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { createClient } from "@/lib/supabase/client";

export default function CategoriesManager({ initialCategories }) {
  const { t } = useLanguage();
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const supabase = createClient();

  async function handleAdd(event) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;

    const sort_order =
      categories.reduce((max, c) => Math.max(max, c.sort_order), -1) + 1;

    const { data } = await supabase
      .from("categories")
      .insert({ name, sort_order })
      .select()
      .single();

    if (data) {
      setCategories((prev) => [...prev, data]);
      setNewName("");
    }
  }

  function startEditing(category) {
    setEditingId(category.id);
    setEditingName(category.name);
  }

  async function saveEditing(id) {
    const name = editingName.trim();
    setEditingId(null);
    if (!name) return;

    await supabase.from("categories").update({ name }).eq("id", id);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c))
    );
  }

  async function handleDelete(id) {
    if (!window.confirm(t.admin.confirmDelete)) return;
    await supabase.from("categories").delete().eq("id", id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleMove(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= categories.length) return;

    const next = [...categories];
    const [a, b] = [next[index], next[target]];
    [a.sort_order, b.sort_order] = [b.sort_order, a.sort_order];
    next[index] = b;
    next[target] = a;
    setCategories(next);

    await Promise.all([
      supabase.from("categories").update({ sort_order: a.sort_order }).eq("id", a.id),
      supabase.from("categories").update({ sort_order: b.sort_order }).eq("id", b.id),
    ]);
  }

  return (
    <div className="max-w-xl space-y-6">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          required
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder={t.admin.name}
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
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
        {categories.map((category, index) => (
          <li key={category.id} className="flex items-center gap-3 px-4 py-3">
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
                disabled={index === categories.length - 1}
                className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                aria-label="Move down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {editingId === category.id ? (
              <input
                autoFocus
                type="text"
                value={editingName}
                onChange={(event) => setEditingName(event.target.value)}
                onBlur={() => saveEditing(category.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveEditing(category.id);
                }}
                className="flex-1 rounded-lg border border-orange-400 px-2 py-1 text-sm focus:outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => startEditing(category)}
                className="flex-1 text-left text-sm text-neutral-900 hover:text-orange-600"
              >
                {category.name}
              </button>
            )}

            <button
              type="button"
              onClick={() => handleDelete(category.id)}
              className="text-neutral-400 hover:text-red-600"
              aria-label={t.admin.delete}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {categories.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-neutral-400">—</li>
        )}
      </ul>
    </div>
  );
}
