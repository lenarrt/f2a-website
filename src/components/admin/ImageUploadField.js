"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/storage";

export default function ImageUploadField({ bucket, value, onChange, label }) {
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const url = await uploadImage(supabase, bucket, file);
      onChange(url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
          {value ? (
            <Image
              src={value}
              alt=""
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-6 w-6 text-neutral-300" />
          )}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
          {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
          {uploading ? t.admin.saving : t.admin.uploadImage}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
