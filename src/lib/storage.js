const UPLOAD_TIMEOUT_MS = 30000;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB

export async function uploadImage(supabase, bucket, file) {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("FILE_TOO_LARGE");
  }

  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;

  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("UPLOAD_TIMEOUT")), UPLOAD_TIMEOUT_MS);
  });

  let error;
  try {
    ({ error } = await Promise.race([
      supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      }),
      timeout,
    ]));
  } finally {
    clearTimeout(timeoutId);
  }

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}
