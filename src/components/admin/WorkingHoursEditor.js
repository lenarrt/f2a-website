"use client";

import { DAYS_ORDER } from "@/lib/workingHours";
import { useLanguage } from "@/hooks/useLanguage";

export default function WorkingHoursEditor({ value, onChange }) {
  const { t } = useLanguage();

  function updateDay(day, patch) {
    onChange({ ...value, [day]: { ...value[day], ...patch } });
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700">
        {t.admin.workingHours}
      </label>
      <div className="space-y-2 rounded-lg border border-neutral-300 p-3">
        {DAYS_ORDER.map((day) => {
          const dayValue = value?.[day] ?? { closed: true, open: null, close: null };
          return (
            <div key={day} className="flex flex-wrap items-center gap-3">
              <span className="w-24 shrink-0 text-sm text-neutral-700">
                {t.days[day]}
              </span>

              {!dayValue.closed && (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={dayValue.open ?? ""}
                    onChange={(event) => updateDay(day, { open: event.target.value })}
                    className="rounded-lg border border-neutral-300 px-2 py-1 text-sm focus:border-orange-600 focus:outline-none"
                  />
                  <span className="text-neutral-400">–</span>
                  <input
                    type="time"
                    value={dayValue.close ?? ""}
                    onChange={(event) => updateDay(day, { close: event.target.value })}
                    className="rounded-lg border border-neutral-300 px-2 py-1 text-sm focus:border-orange-600 focus:outline-none"
                  />
                </div>
              )}

              <label className="ml-auto flex items-center gap-1.5 text-xs text-neutral-600">
                <input
                  type="checkbox"
                  checked={dayValue.closed}
                  onChange={(event) =>
                    updateDay(day, {
                      closed: event.target.checked,
                      open: dayValue.open ?? "09:00",
                      close: dayValue.close ?? "17:00",
                    })
                  }
                />
                {t.contact.closed}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
