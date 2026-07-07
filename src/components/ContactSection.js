"use client";

import { Phone, Mail, Clock, MapPin, MessageCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { FacebookIcon, InstagramIcon } from "@/components/icons/SocialIcons";
import { googleMapsUrl, googleMapsEmbedUrl, whatsappUrl, telUrl } from "@/lib/maps";

export default function ContactSection({ settings }) {
  const { t } = useLanguage();
  const hasCoords = settings.lat != null && settings.lng != null;
  const mapsUrl = hasCoords ? googleMapsUrl(settings.lat, settings.lng) : null;

  return (
    <section id="contact" className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-xl font-bold text-neutral-900">{t.contact.title}</h2>

        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <ul className="space-y-3 text-sm text-neutral-700">
            {settings.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-orange-600" />
                <a href={telUrl(settings.phone)} className="hover:text-orange-600">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-orange-600" />
                <a href={`mailto:${settings.email}`} className="hover:text-orange-600">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.working_hours && (
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-orange-600" />
                <span>{settings.working_hours}</span>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-orange-600 mt-0.5" />
                <span>{settings.address}</span>
              </li>
            )}
          </ul>

          <div className="flex flex-col gap-3">
            {settings.whatsapp_number && (
              <a
                href={whatsappUrl(settings.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 w-fit"
              >
                <MessageCircle className="h-4 w-4" />
                {t.contact.whatsapp}
              </a>
            )}

            {(settings.facebook_url || settings.instagram_url) && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-neutral-500">
                  {t.contact.follow}
                </p>
                <div className="flex gap-3">
                  {settings.facebook_url && (
                    <a
                      href={settings.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-700 border border-neutral-200 hover:text-orange-600"
                    >
                      <FacebookIcon className="h-4 w-4" />
                    </a>
                  )}
                  {settings.instagram_url && (
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-700 border border-neutral-200 hover:text-orange-600"
                    >
                      <InstagramIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {hasCoords && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block h-40 overflow-hidden rounded-lg border border-neutral-200 sm:col-span-2 lg:col-span-1"
              aria-label={t.contact.viewOnMap}
            >
              <iframe
                src={googleMapsEmbedUrl(settings.lat, settings.lng)}
                className="pointer-events-none h-full w-full"
                loading="lazy"
                title="Map"
              />
              <span className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {t.contact.viewOnMap}
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
