import HeroCarousel from "@/components/HeroCarousel";
import Newsletter from "@/components/Newsletter";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { getAllProducts } from "@/lib/actions";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Home = async () => {
  const allProduct = await getAllProducts();
  const { userId } = auth();
  return (
    <>
      <section className="px-6 md:px-20 py-24">
        {!userId && (
          <div className="flex flex-col items-center justify-center mb-14">
            <h1 className="text-4xl text-center font-bold mb-8">
              Welcome to Your Ultimate Amazon Product Scraper!
            </h1>

            <p className="text-center px-16">
              Introducing our cutting-edge web scraping product portal, designed
              to streamline the process of gathering detailed product
              information from Amazon. Our platform leverages advanced web
              scraping techniques to automatically collect data such as product
              titles, prices, descriptions, reviews, and ratings. With our
              intuitive interface, users can easily track and compare products,
              monitor price changes, and analyze trends. This powerful tool
              saves time and enhances decision-making by providing accurate and
              up-to-date product data directly from Amazon, ensuring you always
              have the competitive edge in the market. Whether you're a
              retailer, researcher, or enthusiast, our web scraping portal is
              your ultimate resource for comprehensive product insights.
            </p>
            <div className="flex justify-between gap-5 my-6 w-full">
              <button className="btn1 w-1/3 mx-auto flex items-center justify-center gap-3">
                <Link href="/sign-in" className="text-base text-white ">
                  Click here to start scraping products
                </Link>
              </button>
            </div>
            <Image
              src="/assets/icons/hand-drawn-arrow.svg"
              alt="arrow"
              width={175}
              height={175}
              className="max-xl-hidden absolute -left[15%] top-12 z-0"
            />
          </div>
        )}
        <div className="flex gap-16 justify-center items-center">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart Shoping Starts Here:
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>
            <h1 className="head-text">
              Unleash the power of{" "}
              <span className="text-primery">Web Scraper</span>
            </h1>
            <p className="mt-6">
              Powerful self-serve product and growth analytics to help you
              convert, engage, and retain more.
            </p>

            {userId ? <SearchBar /> : <Newsletter />}
          </div>
          <HeroCarousel />
        </div>
      </section>
      <section className="trending-section">
        <h2 className="section-text"> Trending Products</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProduct?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
