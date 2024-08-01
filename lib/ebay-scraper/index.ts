"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import {
  extractCurrency,
  extractDescription,
  extractEbayDescription,
  extractPrice,
} from "../../lib/utils";

export async function scrapeEbayProduct(url: string) {
  if (!url) return;

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    const iframeSrc: any = $("#desc_ifr").attr("src");

    // Fetch the iframe content
    const iframeResponse = await axios.get(iframeSrc);
    const iframeContent = cheerio.load(iframeResponse.data);

    // Extract text from the iframe
    const productDescription = iframeContent(".x-item-description-child")
      .text()
      .trim();

    // Extract the product title
    const title = $("h1.x-item-title__mainTitle").text().trim();

    const currentPrice = extractPrice($(".x-price-primary span.ux-textspans"));

    const imageUrlsArr: any = [];
    $("div.ux-image-carousel-item img").each((index, element) => {
      const srcset = $(element).attr("data-srcset");
      if (srcset) {
        const urls = srcset.split(",").map((src) => src.trim().split(" ")[0]);
        const filteredUrls = urls.filter((url) => url.includes("1600.jpg"));
        imageUrlsArr.push(...filteredUrls);
      }
    });

    const category = $(".seo-breadcrumbs-container li").last().text().trim();

    const itemSpecifics: any = [];

    $("dl.ux-labels-values").each((index, element) => {
      const name = $(element)
        .find("dt.ux-labels-values__labels span.ux-textspans")
        .text()
        .trim();
      const value = $(element)
        .find("dd.ux-labels-values__values span.ux-textspans")
        .text()
        .trim();

      if (name && value) {
        itemSpecifics.push({ name, value });
      }
    });

    // Construct data object with scraped information
    const data = {
      url,
      currency: "$",
      image: imageUrlsArr[0],
      sliderImages: imageUrlsArr,
      title,
      discount: 0,
      currentPrice: Number(currentPrice) || 0,
      originalPrice: 0 || Number(currentPrice),
      priceHistory: [],
      discountRate: 0,
      category,
      reviewsCount: 100,
      stars: 0,
      isOutOfStock: false,
      description: "",
      productDescription,
      productInformationTech: itemSpecifics,
      productInformationAdditional: [],
      lowestPrice: Number(currentPrice) || 0,
      highestPrice: 0 || Number(currentPrice),
      averagePrice: Number(currentPrice) || 0,
    };

    return data;
  } catch (error: any) {
    console.log(error);
  }
}
