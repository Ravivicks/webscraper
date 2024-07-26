"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
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

    // Extract the product title
    const title = $("#productTitle").text().trim();
    const discountPercentage = $("span.savingsPercentage").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $(".a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base")
    );

    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );

    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";

    const imageUrls = Object.keys(JSON.parse(images));
    const imageUrlsArr: any = [];
    $("#aplus_feature_div img").each(function () {
      imageUrlsArr.push($(this).attr("src"));
    });

    const urlToRemove =
      "https://images-na.ssl-images-amazon.com/images/G/01/x-locale/common/grey-pixel.gif";

    const filteredUrls = imageUrlsArr.filter((url: any) => url !== urlToRemove);

    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

    const description = extractDescription($);
    const productDescription = $("div#productDescription").text().trim();

    const stars = $(
      "span.reviewCountTextLinkedHistogram.noUnderline .a-size-base.a-color-base"
    )
      .text()
      .trim();

    const productInformationTech: any = [];
    $("#prodDetails table#productDetails_techSpec_section_1 tr").each(
      (i, element) => {
        const name = $(element).find("th").text().trim();
        const value = $(element).find("td").text().trim();

        if (name && value) {
          productInformationTech.push({ name, value });
        }
      }
    );
    const productInformationAdditional: any = [];
    $("#prodDetails table#productDetails_detailBullets_sections1 tr").each(
      (i, element) => {
        const name = $(element).find("th").text().trim();
        const value = $(element).find("td").text().trim();

        if (name && value) {
          productInformationAdditional.push({ name, value });
        }
      }
    );

    // Construct data object with scraped information
    const data = {
      url,
      currency: currency || "$",
      image: imageUrls[0],
      sliderImages: filteredUrls,
      title,
      discount: discountPercentage,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "category",
      reviewsCount: 100,
      stars: Number(stars.split(" ")[0]),
      isOutOfStock: outOfStock,
      description,
      productDescription,
      productInformationTech,
      productInformationAdditional,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    return data;
  } catch (error: any) {
    console.log(error);
  }
}
