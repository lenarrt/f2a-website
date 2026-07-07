import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/data";
import { withPlaceholderFallback } from "@/lib/constants";
import { LanguageProvider } from "@/context/LanguageContext";
import StructuredData from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const settings = withPlaceholderFallback(await getSettings());
  const title = `${settings.company_name} — ${settings.tagline}`;
  const description = settings.description || settings.tagline;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: settings.logo_url ? [settings.logo_url] : [],
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function RootLayout({ children }) {
  const settings = withPlaceholderFallback(await getSettings());

  return (
    <html
      lang="sq"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StructuredData settings={settings} />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
