"use client";
import { Product } from "@/types";
import Image from "next/image";
import React from "react";
import { Carousel } from "react-responsive-carousel";

type Props = {
  sliderImages: any;
};

const BottomCarousel = ({ sliderImages }: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">From the manufacturer</h2>
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={2000}
        showArrows={true}
        showStatus={false}
      >
        {sliderImages?.map((img: any, index: any) => (
          <Image
            key={String(index)}
            src={img}
            alt={img}
            width={1200}
            height={100}
            className="object-fill h-[500px]"
          />
        ))}
      </Carousel>
    </div>
  );
};

export default BottomCarousel;
