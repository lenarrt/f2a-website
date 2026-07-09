"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_WORKING_HOURS } from "@/lib/workingHours";
import ImageUploadField from "@/components/admin/ImageUploadField";
import WorkingHoursEditor from "@/components/admin/WorkingHoursEditor";

const FIELDS = [
  ["company_name", "companyName", "text"],
  ["tagline", "tagline", "text"],
  ["description", "shortDescription", "textarea"],
  ["phone", "phone", "text"],
  ["email", "email", "text"],
  ["address", "address", "text"],
  ["lat", "latitude", "number"],
  ["lng", "longitude", "number"],
  ["whatsapp_number", "whatsappNumber", "text"],
  ["facebook_url", "facebookUrl", "text"],
  ["instagram_url", "instagramUrl", "text"],
];

export default function SettingsForm({ initialSettings }) {
  const { t } = useLanguage();
  const [values, setValues] = useState({
    company_name: initialSettings?.company_name ?? "",
    tagline: initialSettings?.tagline ?? "",
    description: initialSettings?.description ?? "",
    logo_url: initialSettings?.logo_url ?? null,
    phone: initialSettings?.phone ?? "",
    email: initialSettings?.email ?? "",
    address: initialSettings?.address ?? "",
    working_hours: initialSettings?.working_hours ?? DEFAULT_WORKING_HOURS,
    lat: initialSettings?.lat ?? "",
    lng: initialSettings?.lng ?? "",
    whatsapp_number: initialSettings?.whatsapp_number ?? "",
    facebook_url: initialSettings?.facebook_url ?? "",
    instagram_url: initialSettings?.instagram_url ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    await supabase
      .from("settings")
      .upsert(
        {
          id: 1,
          ...values,
          lat: values.lat === "" ? null : Number(values.lat),
          lng: values.lng === "" ? null : Number(values.lng),
        },
        { onConflict: "id" }
      );

    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <ImageUploadField
        bucket="logos"
        value={values.logo_url}
        onChange={(url) => updateField("logo_url", url)}
        label={t.admin.logo}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map(([field, labelKey, type]) => (
          <div key={field} className={type === "textarea" ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              {t.admin[labelKey]}
            </label>
            {type === "textarea" ? (
              <textarea
                rows={3}
                value={values[field]}
                onChange={(event) => updateField(field, event.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
              />
            ) : (
              <input
                type={type}
                step={type === "number" ? "any" : undefined}
                value={values[field]}
                onChange={(event) => updateField(field, event.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-orange-600 focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>

      <WorkingHoursEditor
        value={values.working_hours}
        onChange={(workingHours) => updateField("working_hours", workingHours)}
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
        >
          {saving ? t.admin.saving : t.admin.save}
        </button>
        {saved && <span className="text-sm text-green-600">{t.admin.saved}</span>}
      </div>
    </form>
  );
}
