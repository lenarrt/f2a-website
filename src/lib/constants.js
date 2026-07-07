// Placeholder content shown until the real F2A details are entered in /admin.
export const PLACEHOLDER_SETTINGS = {
  company_name: "F2A",
  tagline: "Materiale ndertimi dhe suvatim me cilesi te larte",
  description:
    "F2A eshte nje kompani e specializuar ne materiale ndertimi dhe suvatim, duke ofruar produkte cilesore per profesionistet dhe amatoret.",
  logo_url: null,
  phone: "+383 44 000 000",
  email: "info@f2a-example.com",
  address: "Rruga Kryesore, Prishtine, Kosove",
  lat: 42.6629,
  lng: 21.1655,
  working_hours: "Hene - Premte: 08:00 - 17:00, Shtune: 09:00 - 14:00",
  whatsapp_number: null,
  facebook_url: null,
  instagram_url: null,
};

export const KURTISHI_SOLUTIONS_URL = "https://kurtishisolutions.com";

// Fills any null/empty field coming from the DB with placeholder content,
// so the site always renders something reasonable before the client's
// real details are entered in /admin.
export function withPlaceholderFallback(settings) {
  const merged = { ...PLACEHOLDER_SETTINGS };
  for (const key of Object.keys(merged)) {
    const value = settings?.[key];
    if (value !== null && value !== undefined && value !== "") {
      merged[key] = value;
    }
  }
  return merged;
}
