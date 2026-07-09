export const DAYS_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const DEFAULT_WORKING_HOURS = {
  mon: { closed: false, open: "09:00", close: "17:00" },
  tue: { closed: false, open: "09:00", close: "17:00" },
  wed: { closed: false, open: "09:00", close: "17:00" },
  thu: { closed: false, open: "09:00", close: "17:00" },
  fri: { closed: true, open: null, close: null },
  sat: { closed: false, open: "09:00", close: "17:00" },
  sun: { closed: true, open: null, close: null },
};

const SCHEMA_DAY_NAMES = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export function toSchemaOpeningHours(workingHours) {
  if (!workingHours) return [];
  return DAYS_ORDER.filter((day) => !workingHours[day]?.closed).map((day) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${SCHEMA_DAY_NAMES[day]}`,
    opens: workingHours[day].open,
    closes: workingHours[day].close,
  }));
}
