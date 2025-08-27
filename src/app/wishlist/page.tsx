"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "@/baseURL";
import { useWishlist } from "@/hooks/useWishlist";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setWishlist } from "@/store/slices/wishlistSlice";
import { AuthActions } from "@/auth/utils";
import axiosAuth from "@/auth/axiosAuth";

interface Product {
  id: number;
  slug: string;
  title: string;
  price: number;
  sale_price: number | null;
  sizes: { id: number; size: string }[];
  favourite_id?: number; // 👈 добавить это
  image: string;
}

const Wishlist = () => {
  const {wishlist, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const isAuth = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuth) {
        const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
        dispatch(setWishlist(local));

        if (local.length > 0) {
          try {
            const res = await axios.get(
              `${baseURL}tailor/wishlist-products/en/?ids=${local.join(",")}`
            );
            setProducts(res.data);
          } catch (e) {
            console.error("❌ Ошибка загрузки товаров избранного гостя:", e);
          }
        }

        setLoading(false);
        return;
      }

      try {
        const res = await axiosAuth.get(
          `${baseURL}tailor/wishlist-products/en/`
        );
        console.log("📡 Запрос избранного", res.data);

        const ids = res.data.map((item: any) => item.id);
        dispatch(setWishlist(ids));

        // ✅ Убираем дубликаты по product.id
        const uniqueMap = new Map();
        res.data.forEach((item: any) => {
          if (!uniqueMap.has(item.id)) {
            uniqueMap.set(item.id, item);
          }
        });
        const uniqueProducts = Array.from(uniqueMap.values());

        setProducts(uniqueProducts); // 👈 здесь
      } catch (e) {
        console.error("Wishlist fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuth, dispatch]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex gap-4 flex-wrap px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-36">
      {products &&
        products?.map((item) => (
          <div key={item.favourite_id} className="relative w-[198px]">
            <Link href={`/${item.slug}`}>
              <div className="relative bg-slate-100 w-full aspect-[3/4]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="20vw"
                  className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity duration-500"
                />
              </div>
            </Link>

            <button
              onClick={() => {
                removeFromWishlist(item.favourite_id, item.id);
                setProducts((prev) => prev.filter((p) => p.id !== item.id));
              }}
              className="absolute top-4 right-4 z-30 bg-white p-1 rounded-full hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3 className="mt-4 text-[#5c5c5c] text-sm font-normal tracking-wide">
              {item.title}
            </h3>
            <p className="mt-1 text-[#5c5c5c] text-sm font-normal tracking-wide">
              {item.price} AZN
            </p>
            <div className="mt-3 text-[#5c5c5c] text-xs flex gap-3">
              {item.sizes.map((size) => (
                <span key={size.id}>{size.size}</span>
              ))}
            </div>
          </div>
        ))}

      {products.length === 0 && !loading && (
        <p className="text-center w-full text-gray-500 mt-10">
          No items in your wishlist.
        </p>
      )}
    </div>
  );
};

export default Wishlist;
