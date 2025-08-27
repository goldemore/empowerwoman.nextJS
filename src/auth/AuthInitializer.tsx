"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import { setWishlist } from "@/store/slices/wishlistSlice";
import { AuthActions } from "./utils";
import axiosAuth from "./axiosAuth";
import { baseURL } from "@/baseURL";

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        const res = await AuthActions.handleJWTRefresh();
        const access = res.data.access;
        AuthActions.storeToken(access);
        dispatch(setAuth(true));
      } catch (err: any) {
        const status = err?.response?.status;
        if (status !== 400 && status !== 401) {
          console.error("❌ Ошибка обновления токена:", err);
        }
        dispatch(setAuth(false));
      }

      // 👉 ИНИЦИАЛИЗАЦИЯ ИЗБРАННОГО
      const token = AuthActions.getToken();
      const isAuthenticated = !!token;

      if (isAuthenticated) {
        try {
          const wishlistRes = await axiosAuth.get(`${baseURL}tailor/wishlist-products/en/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const ids = wishlistRes.data.map((item: any) => item.id);
          dispatch(setWishlist(ids));
        } catch (wishlistErr) {
          console.error("❌ Ошибка загрузки избранного:", wishlistErr);
        }
      } else {
        const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
        dispatch(setWishlist(local));
      }
    };

    init();
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
