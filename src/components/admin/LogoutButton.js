"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const { t } = useLanguage();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
    >
      <LogOut className="h-4 w-4" />
      {t.admin.logout}
    </button>
  );
}
