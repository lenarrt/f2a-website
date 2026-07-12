"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";

export default function AdminNav() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const tabs = [
    { href: "/admin/settings", label: t.admin.settings },
    { href: "/admin/partners", label: t.admin.partnersTab },
    { href: "/admin/offers", label: t.admin.offersTab },
  ];

  return (
    <nav className="flex gap-1 border-b border-neutral-200">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border-b-2 px-4 py-3 text-sm font-medium ${
              active
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
