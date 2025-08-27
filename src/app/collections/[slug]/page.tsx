"use client";

import { baseURL } from "@/baseURL";
import AccordionFilter from "@/components/AccordionFilter";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

type ProductForCard = {
  id: number;
  title: string;
  slug: string;
  price: number;
  sizes: { id: number; size: string }[];
  // с сервера часто приходит [{id, image: "..."}], иногда просто ["..."]
  product_images: string[];
};

type FilterItem = {
  key: string;
  title: string;
  type: "range" | "color" | "checkbox" | "buttons";
  min?: number;
  max?: number;
  values?: { label: string; value: string | number }[];
};

const CollectionsList = ({ params }: { params: { slug: string } }) => {
  const [active, setActive] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [activeSort, setActiveSort] = useState(false);
  const [products, setProducts] = useState<ProductForCard[]>([]);
  const [collectionName, setCollectionName] = useState("");
  const [filters, setFilters] = useState<FilterItem[] | null>(null);
  const [fallbackTried, setFallbackTried] = useState(false);
  const { t, i18n } = useTranslation();

  // useEffect(() => {
  //   const stored = localStorage.getItem("selectedLanguage");
  //   if (stored && stored !== i18n.language) {
  //     i18n.changeLanguage(stored);
  //   }
  // }, [i18n]);
  const sortOptions = useMemo(
    () => ({
      sort_default: t("sort_by_price"),
      price_asc: t("low_to_high"),
      price_desc: t("high_to_low"),
    }),
    [t, i18n.language] as const
  );

  type SortKey = keyof typeof sortOptions;
  const [sortKey, setSortKey] = useState<SortKey>("sort_default");

  const fetchProducts = useCallback(async () => {
    const lang = i18n.language || "az";
    if (!lang) return;
    try {
      const baseURL = `http://127.0.0.1:8000/api/tailor/collections/${params.slug}/${lang}`;
      let url = `${baseURL}/`;
      const queryParams = new URLSearchParams();

      if (appliedFilters.price) {
        queryParams.append("filter.v.price.gte", appliedFilters.price[0]);
        queryParams.append("filter.v.price.lte", appliedFilters.price[1]);
      }

      ["color", "size", "category"].forEach((key) => {
        if (appliedFilters[key]) {
          appliedFilters[key].forEach((val: string) => {
            queryParams.append(
              key === "size"
                ? "filter.v.option.size"
                : key === "category"
                ? "filter.v.category"
                : "filter.v.color",
              val
            );
          });
        }
      });

      if (queryParams.toString()) {
        url = `${baseURL}/filtered/?${queryParams.toString()}`;
      }

      const res = await axios.get(url);
      let data: ProductForCard[] = res.data.products || [];
      if (sortKey === "price_asc") data.sort((a, b) => a.price - b.price);
      else if (sortKey === "price_desc") data.sort((a, b) => b.price - a.price);

      setProducts((res.data.products ?? []) as ProductForCard[]);
      setCollectionName(res.data.collection_name || "");
    } catch (err: any) {
      if (err.response?.status === 404 && lang !== "az" && !fallbackTried) {
        setFallbackTried(true);

        i18n.changeLanguage("az");
      } else {
        console.error("Ошибка загрузки:", err);
      }
    }
  }, [params.slug, i18n.language, appliedFilters, sortKey, fallbackTried]);

  const fetchFilters = useCallback(async () => {
    const lang = i18n.language || "az";
    try {
      const res = await axios.get(
        `${baseURL}tailor/collections-others/${params.slug}/${lang}/`
      );
      console.log(res);

      setFilters(res.data.filters as FilterItem[]);
    } catch (err) {
      console.error("Ошибка загрузки фильтров:", err);
    }
  }, [params.slug, i18n.language]);

  useEffect(() => {
    fetchProducts();
    fetchFilters();
  }, [fetchProducts, fetchFilters]);

  return (
    <div>
      <div className="">
        <Image
          src="/collections_banner.webp"
          alt="Banner"
          width={1000}
          height={1000}
          className="w-full h-auto max-h-[305px] object-cover"
        />
      </div>

      <div className="p-4 text-center">
        <h1 className="font-didot uppercase text-[#171717] text-sm tracking-normal mb-2 ">
          {collectionName}
        </h1>
      </div>

      <div className="">
        <div className="flex justify-between px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36 ">
          <div
            className="flex gap-1 items-center cursor-pointer select-none"
            onClick={() => setActive(!active)}
          >
            <svg
              width="23"
              height="19"
              viewBox="0 0 20 20"
              strokeWidth="1.25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#5c5c5c]"
            >
              <line
                x1={active ? "19" : "1"}
                y1="6"
                x2={active ? "1" : "19"}
                y2="6"
                stroke="currentColor"
              />
              <line
                x1={active ? "19" : "1"}
                y1="14"
                x2={active ? "1" : "19"}
                y2="14"
                stroke="currentColor"
              />
              <circle
                cx={active ? "13" : "7"}
                cy="6"
                r="3"
                stroke="currentColor"
              />
              <circle
                cx={active ? "7" : "13"}
                cy="14"
                r="3"
                stroke="currentColor"
              />
            </svg>
            <span className="text-sm text-[#5c5c5c]">Filter</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#5c5c5c]"
              style={{ transform: active ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </div>
          <span className="text-sm text-[#5c5c5c]">
            {products?.length} {t("col_pro_for_count")}
          </span>
          <div className="relative text-sm text-[#5c5c5c]">
            <div
              className="cursor-pointer select-none"
              onClick={() => setActiveSort(!activeSort)}
            >
              {sortOptions[sortKey]}
            </div>
            {activeSort && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50">
                
                {Object.keys(sortOptions).map((key) => (
                  <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    key={key}
                    onClick={() => {
                      setSortKey(key as SortKey);
                      setActiveSort(false);
                    }}
                  >
                    {sortOptions[key as SortKey]}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex gap-4 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36 mt-4">
          <div
            className={`hidden md:block transition-all duration-300 ${
              active ? "w-64" : "w-0"
            }`}
          >
            {Array.isArray(filters) && filters.length > 0 && active && (
              <AccordionFilter
                filters={filters}
                appliedFilters={appliedFilters}
                setAppliedFilters={setAppliedFilters}
              />
            )}
          </div>
          <div className="flex-1 grid gap-4 grid-cols-2 md:grid-cols-4 transition-all duration-300">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center text-[#5c5c5c] text-sm mt-6">
                Bu kolleksiya hələ məhsul ilə doldurulmayıb.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsList;
