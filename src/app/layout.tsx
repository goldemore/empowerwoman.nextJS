// app/layout.tsx
import type { Metadata } from "next";
import { GFS_Didot, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { ReduxProvider } from "@/store/Providers";
import AuthInitializer from "@/auth/AuthInitializer";
import ClientProviders from "@/lib/ClientProviders";
import { cookies } from "next/headers";
import { baseURL } from "@/baseURL";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  weight: ["400", "600", "700"],
});

const gfsDidot = GFS_Didot({
  subsets: ["greek"],
  weight: ["400"],
  variable: "--font-gfs-didot",
});

// ===== SEO helpers =====
type Lang = "az" | "en";

async function getSEO(lang: Lang) {
  const t = (await import(`@/../public/locales/${lang}/translation.json`)).default.seo;
  return t.home;
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = (cookies().get("selectedLanguage")?.value ?? "az") as Lang;
  const seo = await getSEO(lang);

 return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      siteName: "Empower Woman",
      url: seo.url,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    },
    alternates: {
      canonical: seo.url,
      languages: {
        az: "https://empowerwoman.az",
        en: "https://empowerwoman.az/en",
      },
    },
  };
}

// ===== Collections (как у тебя было) =====
export type Collection = { id: number; name: string; slug: string };

async function getCollections(lang: string): Promise<Collection[]> {
  const res = await fetch(`${baseURL}tailor/collections-list/${lang}/`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

// ===== Layout =====
export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const lang = cookies().get("selectedLanguage")?.value || "az";
  const collections = await getCollections(lang);

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${hankenGrotesk.className} ${gfsDidot.variable}`}>
        <ReduxProvider>
          <ClientProviders>
            <AuthInitializer />
            <AnnouncementBar />
            <Navbar collections={collections} />
            <main>{children}</main>
            <Footer collections={collections} />
          </ClientProviders>
        </ReduxProvider>
      </body>
    </html>
  );
}
