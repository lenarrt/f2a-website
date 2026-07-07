export function googleMapsUrl(lat, lng) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function googleMapsEmbedUrl(lat, lng, zoom = 15) {
  return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
}

export function whatsappUrl(number) {
  const digits = number.replace(/[^\d+]/g, "");
  return `https://wa.me/${digits.replace("+", "")}`;
}

export function telUrl(phone) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
