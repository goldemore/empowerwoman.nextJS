import { baseURL } from "@/baseURL";
import { cookies } from "next/headers";
import Image from "next/image";

// next: { revalidate: 3600 }
// Это ISR (Incremental Static Regeneration).
// Next.js кеширует страницу на 3600 секунд (1 час).
// Если на сервере данные изменились, фронт покажет старые данные до следующей генерации
// (через 1 час или при первом запросе после этого времени).

//  { cache: "no-store" }
// Полностью отключает кеш.
// Всегда делает новый запрос к серверу.

async function getHeroBaner(lang: string) {
  const res = await fetch(`${baseURL}tailor/home-page-hero/${lang}/`, {
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("Fetch failed:", res.status, res.statusText);
    return null; // или throw new Error(...)
  }
  return res.json();
}


const Hero = async () => {
  const cookieStore = cookies();
  const lang = cookieStore.get("selectedLanguage")?.value || "az";

  const hero = await getHeroBaner(lang);
  console.log(`${baseURL}tailor/home-page-hero/${lang}/`);
  return (
    <div className="relative w-full h-screen">
      <Image
        src={hero[0]?.image}
        alt="Hero Image"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
};

export default Hero;
