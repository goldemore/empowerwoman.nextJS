import { cookies } from "next/headers";
import { baseURL } from "@/baseURL";
import NewArrivalsClient from "./NewArrivals";


type Product = {
  id: number;
  title: string;
  slug: string;
  product_images: string[];
  price: number;
  sizes: { id: number; size: string }[];
};

type NewArrivalsResponse = {
  results: Product[];
  count: number;
};

async function fetchNewArrivals(lang: string, page = 1): Promise<NewArrivalsResponse> {
  const res = await fetch(`${baseURL}tailor/home-product-list/${lang}/?page=${page}`, {
    next: { revalidate: 300 }, // SSR кэш на 5 минут
  });
  if (!res.ok) return { results: [], count: 0 };
  return res.json();
}

export default async function NewArrivalsServer() {
  const lang = cookies().get("selectedLanguage")?.value || "az";
  const initial = await fetchNewArrivals(lang, 1);

  return (
    <NewArrivalsClient
      initial={initial}
      lang={lang}
      perPage={8}
    />
  );
}
