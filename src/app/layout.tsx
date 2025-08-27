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

export const metadata: Metadata = {
  title: "Empowerwoman E-Commerce Application",
  description: "A complete e-commerce application with Next.js and Django",
};

export type Collection = { id: number; name: string; slug: string };

async function getCollections(lang: string): Promise<Collection[]> {
  const res = await fetch(`${baseURL}tailor/collections-list/${lang}/`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
