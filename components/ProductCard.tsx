import { formatNumber } from "@/lib/utils";
import { IProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  product: IProduct;
}

const ProductCard = ({ product }: Props) => {
  return (
    <Link href={`/products/${product._id}`} className="product-card">
      <div className="product-card_img-container">
        <Image
          src={product.image}
          alt={product.title}
          className="product-card_img"
          width={200}
          height={200}
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <p className="text-black text-lg font-semibold">
            <span>{product?.currency}</span>
            <span>{product?.currentPrice}</span>
          </p>
          <div className="product-stars">
            <Image
              src="/assets/icons/star.svg"
              alt="star"
              width={16}
              height={16}
            />
            <p className="text-sm text-primary-orange font-semibold">
              {product.stars || "25"}
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <p className="text-[15px] text-black opacity-50 line-through">
            {product.currency} {formatNumber(product.originalPrice)}
          </p>
          <div className="product-reviews">
            <Image
              src="/assets/icons/comment.svg"
              alt="review"
              width={16}
              height={16}
            />
            <p className="text-sm text-secondary font-semibold">
              {product.reviewsCount} Reviews
            </p>
          </div>
        </div>
        <h5 className="product-title my-3" title={product.title}>
          {product.title}
        </h5>
      </div>
    </Link>
  );
};

export default ProductCard;
