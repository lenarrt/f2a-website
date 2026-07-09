"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import ImageUploadField from "@/components/admin/ImageUploadField";

const EMPTY = {
  name: "",
  category_id: "",
  price: "",
  image_url: null,
  description: "",
};

export default function ProductForm({ categories, initialValues, onSave, onCancel }) {
  const { t } = useLanguage();
  const [values, setValues] = useState({
    ...EMPTY,
    ...initialValues,
    // Optional DB fields (description, price) come back as null rather than
    // "" when unset, which would otherwise overwrite the EMPTY defaults above.
    name: initialValues?.name ?? "",
    price: initialValues?.price ?? "",
    description: initialValues?.description ?? "",
  });
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const name = (values.name ?? "").trim();
    if (!name || !values.category_id) return;

    setSaving(true);
    try {
      // Only send actual product columns — `values` may also carry fields
      // like a joined `category` object, `id`, or `created_at` when editing
      // an existing product, none of which are valid in an insert/update.
      await onSave({
        name,
        category_id: values.category_id,
        image_url: values.image_url,
        price: values.price === "" ? null : Number(values.price),
        description: (values.description ?? "").trim() || null,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-orange-200 bg-orange-50/40 p-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            {t.admin.name}
          </label>
          <input
            type="text"
            required
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            {t.admin.category}
          </label>
          <select
            required
            value={values.category_id}
            onChange={(event) => update("category_id", event.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
          >
            <option value="" disabled>
              {t.admin.noCategorySelected}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            {t.admin.price}
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={(event) => update("price", event.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
          />
          <p className="mt-1 text-xs text-neutral-500">{t.admin.priceHint}</p>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          {t.admin.description}
        </label>
        <textarea
          rows={2}
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
        />
      </div>

      <ImageUploadField
        bucket="products"
        value={values.image_url}
        onChange={(url) => update("image_url", url)}
        label={t.admin.image}
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
        >
          {saving ? t.admin.saving : t.admin.save}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        >
          {t.admin.cancel}
        </button>
      </div>
    </form>
  );
}
