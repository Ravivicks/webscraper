import BottomCarousel from "@/components/BottomCarousel";
import PriceInfoCard from "@/components/PriceInfoCard";
import ProductCard from "@/components/ProductCard";
import { getProductById, getSimilarProducts } from "@/lib/actions";
import { formatNumber } from "@/lib/utils";
import { Product } from "@/types";
import Image from "next/image";
import React from "react";

type Props = {
  params: { id: string };
};

const ProductDetail = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);
  const similarProduct = await getSimilarProducts(id);
  const detailsArray = product?.description.trim().split("\n") || [];
  const brand = product.productInformationTech.filter(
    (item) => item.name == "Brand"
  );

  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <div className="flex flex-row-reverse">
            <Image
              src={product?.image}
              alt={product?.title}
              width={580}
              height={400}
              className="mx-auto"
            />
            <div>
              {/* <div className="flex items-center justify-center gap-3 flex-wrap flex-col mx-3">
                {product.sliderImages?.map((url, index) => (
                  <Image
                    className="p-3 border rounded-lg"
                    key={index}
                    src={url}
                    alt={String(index)}
                    width={100}
                    height={100}
                  />
                ))}
              </div> */}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {product?.title}
              </p>
              <p>
                {brand[0].name}: {brand[0].value}
              </p>
              <div className="flex gap-3">
                <div className="product-stars">
                  <Image
                    src="/assets/icons/star.svg"
                    alt="star"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-primary-orange font-semibold">
                    {product?.stars || "25"}
                  </p>
                </div>
                <div className="product-reviews">
                  <Image
                    src="/assets/icons/comment.svg"
                    alt="review"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-secondary font-semibold">
                    {product?.reviewsCount} Reviews
                  </p>
                </div>
              </div>
              {/* <Link
                href={product?.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                Visit product
              </Link> */}
            </div>
            {/* <div className="flex items-center gap-3">
              <div className="product-heart">
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="heart"
                  width={20}
                  height={20}
                />
                <p className="text-base font-semibold text-[#D46F77]">
                  {" "}
                  {product?.reviewsCount}
                </p>
              </div>
              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>
              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/share.svg"
                  alt="share"
                  width={20}
                  height={20}
                />
              </div>
            </div> */}
          </div>
          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold">
                {product?.discount && (
                  <span className="text-red-400 text-lg font-normal mr-2">
                    {product?.discount}
                  </span>
                )}
                {product?.currency} {formatNumber(product?.currentPrice)}
              </p>
              <p className="text-[16px] text-black opacity-50 ">
                M. R. P.:
                <span className="line-through ml-2">
                  {product?.currency} {formatNumber(product?.originalPrice)}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-black opacity-50">
                <span className="text-primary-green font-semibold">93%</span> of
                buyer have recommended this
              </p>
            </div>
          </div>
          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product?.currency} ${formatNumber(
                  product?.currentPrice
                )}`}
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product?.currency} ${formatNumber(
                  product?.averagePrice
                )}`}
              />
              <PriceInfoCard
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product?.currency} ${formatNumber(
                  product?.highestPrice
                )}`}
              />
              <PriceInfoCard
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product?.currency} ${formatNumber(
                  product?.lowestPrice
                )}`}
              />
            </div>
          </div>
          <div className="flex justify-between gap-5 my-6">
            <button className="btn1 w-full mx-auto flex items-center justify-center gap-3">
              Buy Now
            </button>
            <button className="btn w-full mx-auto flex items-center justify-center gap-3">
              Add to cart
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-secondary font-semibold">
            Product Description
          </h3>
          <p>{product.productDescription}</p>
          {detailsArray.length > 1 && (
            <div className="flex flex-col gap-4">
              <ul className="list-disc">
                {detailsArray?.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {similarProduct && similarProduct?.length > 0 && (
        <div className="py-14 flex flex-col gap-2 w-full">
          <p className="section-text">Similar Products</p>
          <div className="flex flex-wrap gap-10 mt-7 w-full">
            {similarProduct?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
      <div>
        <h3 className="text-2xl text-secondary font-semibold mb-10">
          Product Information
        </h3>

        <div className="flex gap-5 justify-between">
          <div className="w-1/2 h-fit">
            <p className="text-xl font-semibold text-secondary mb-5">
              Technical Details
            </p>
            <table>
              {product.productInformationTech.map((item, index) => (
                <tr key={index}>
                  <th className="bg-gray-100 border p-2 font-medium text-left pl-5">
                    {item.name}
                  </th>
                  <td className="border p-2 font-normal text-left pl-5">
                    {item.value}
                  </td>
                </tr>
              ))}
            </table>
          </div>
          <div className="w-1/2 h-fit">
            <p className="text-xl font-semibold text-secondary mb-5">
              Additional Details
            </p>
            <table>
              {product.productInformationAdditional.map(
                (item, index) =>
                  item.name !== "Customer Reviews" && (
                    <tr key={index}>
                      <th className="bg-gray-100 border p-2 font-medium text-left pl-5">
                        {item.name}
                      </th>
                      <td className="border p-2 font-normal text-left pl-5">
                        {item.value}
                      </td>
                    </tr>
                  )
              )}
            </table>
          </div>
        </div>
      </div>
      {product?.sliderImages?.length !== 0 && (
        <div className="border-t-gray-800 py-3">
          <BottomCarousel sliderImages={product.sliderImages} />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
