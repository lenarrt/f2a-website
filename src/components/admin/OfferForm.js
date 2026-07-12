"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function OfferForm({ partnerProducts, initialValues, onSave, onCancel }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState(
    initialValues &&
      !initialValues.partner_product_id &&
      (initialValues.title || initialValues.image_url)
      ? "standalone"
      : "product"
  );
  const [values, setValues] = useState({
    partner_product_id: initialValues?.partner_product_id ?? "",
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    image_url: initialValues?.image_url ?? null,
    offer_text: initialValues?.offer_text ?? "",
  });
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    if (nextMode === "product") {
      update("title", "");
      update("image_url", null);
    } else {
      update("partner_product_id", "");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const description = (values.description ?? "").trim() || null;
    const offerText = (values.offer_text ?? "").trim() || null;

    if (mode === "product") {
      if (!values.partner_product_id) return;
    } else {
      if (!(values.title ?? "").trim()) return;
    }

    setSaving(true);
    try {
      await onSave(
        mode === "product"
          ? {
              partner_product_id: values.partner_product_id,
              title: null,
              image_url: null,
              description,
              offer_text: offerText,
            }
          : {
              partner_product_id: null,
              title: values.title.trim(),
              image_url: values.image_url,
              description,
              offer_text: offerText,
            }
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-orange-200 bg-orange-50/40 p-4"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          {t.admin.offerType}
        </label>
        <div className="inline-flex rounded-lg border border-neutral-300 p-0.5 text-sm">
          {[
            ["product", t.admin.linkToProduct],
            ["standalone", t.admin.standalone],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => switchMode(value)}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                mode === value
                  ? "bg-orange-600 text-white"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mode === "product" ? (
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            {t.admin.selectProduct}
          </label>
          <select
            required
            value={values.partner_product_id}
            onChange={(event) => update("partner_product_id", event.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
          >
            <option value="" disabled>
              {t.admin.selectProduct}
            </option>
            {partnerProducts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.partner?.name ? `${item.partner.name} — ${item.name}` : item.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              {t.admin.title}
            </label>
            <input
              type="text"
              required
              value={values.title}
              onChange={(event) => update("title", event.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
            />
          </div>
          <ImageUploadField
            bucket="products"
            value={values.image_url}
            onChange={(url) => update("image_url", url)}
            label={t.admin.image}
          />
        </>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          {t.admin.offerText}
        </label>
        <input
          type="text"
          value={values.offer_text}
          onChange={(event) => update("offer_text", event.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
        />
        <p className="mt-1 text-xs text-neutral-500">{t.admin.offerTextHint}</p>
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
