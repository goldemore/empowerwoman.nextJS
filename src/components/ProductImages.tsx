"use client";
import { useWishlist } from "@/hooks/useWishlist";
import Image from "next/image";
import { useState } from "react";

type ProductImages = {
  id: number;
  image: string;
  product: number;
};
type ProductImagesProps = {
  productImags: ProductImages[]; 
  productID: number;
};

const ProductImages = ({ productImags, productID  }: ProductImagesProps) => {
  // Image galerry
  const [imgID, setImgID] = useState(0);

  

  const { isInWishlist, toggleWishlist } = useWishlist();
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productID);
  };

  return (
    <>
      {/* BIGGEST SCREEN */}
      <div className="hidden md:block space-y-4">
        {/* Big Image */}
        <div className="relative aspect-[3/4]">
          <Image
            src={productImags[0].image}
            alt=""
            width={1000}
            height={1000}
            className="w-full h-auto max-h-[800px] object-cover "
            priority
          />

          {/* Add and remove favorite btn */}
          <button onClick={handleFavoriteClick} className="absolute top-4 right-4">
            {isInWishlist(productID) ? (
              // Полное сердце (избранное)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="black"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 
              2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 
              22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 
              11.54L12 21.35z"
                />
              </svg>
            ) : (
              // Пустое сердце (контур)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-heart"
              >
                <path
                  d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 
              5.6l-1-1a5.5 5.5 0 0 0-7.8 
              7.8l1 1L12 21l7.8-7.8 1-1a5.5 
              5.5 0 0 0 0-7.8z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Small Images in pairs */}
        <div className="grid grid-cols-2 gap-4">
          {productImags.slice(1).map((img) => (
            <Image
              key={img.id}
              src={img.image}
              alt=""
              width={500}
              height={500}
              className="w-full h-auto max-h-[400px] object-cover"
            />
          ))}
        </div>
      </div>
      {/* Mobile screen */}
      <div className="block md:hidden w-full relative">
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-md">
          <Image
            src={productImags[imgID].image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
            className="object-cover object-top"
            priority
          />
          {/* Кнопка избранного — внутри картинки */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 z-10 bg-white/80 p-1 rounded-full"
          >
            {isInWishlist(productID) ? (
              // Полное сердце (избранное)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="black"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 
              2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 
              22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 
              11.54L12 21.35z"
                />
              </svg>
            ) : (
              // Пустое сердце (контур)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-heart"
              >
                <path
                  d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 
              5.6l-1-1a5.5 5.5 0 0 0-7.8 
              7.8l1 1L12 21l7.8-7.8 1-1a5.5 
              5.5 0 0 0 0-7.8z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Галерея */}
        <div className="flex gap-2 mt-2">
          {productImags.map((img, i) => (
            <div key={i} className="w-1/4" onClick={() => setImgID(i)}>
              <Image
                src={img.image}
                alt=""
                width={60}
                height={75}
                className={`w-full h-full object-cover border-b-4 ${
                  imgID === i ? "border-[#7D9395]" : "border-transparent"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductImages;
