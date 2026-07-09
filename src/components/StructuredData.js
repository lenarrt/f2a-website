import { toSchemaOpeningHours } from "@/lib/workingHours";

export default function StructuredData({ settings }) {
  const openingHours = toSchemaOpeningHours(settings.working_hours);

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.company_name,
    description: settings.description || settings.tagline,
    image: settings.logo_url || undefined,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: settings.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.address,
        }
      : undefined,
    geo:
      settings.lat != null && settings.lng != null
        ? {
            "@type": "GeoCoordinates",
            latitude: settings.lat,
            longitude: settings.lng,
          }
        : undefined,
    sameAs: [settings.facebook_url, settings.instagram_url].filter(Boolean),
    openingHoursSpecification: openingHours.length ? openingHours : undefined,
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
