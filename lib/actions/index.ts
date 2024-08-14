"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { scrapeEbayProduct } from "../ebay-scraper";
import type { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";
import fetch from "node-fetch";

export async function scrapeAndStoreProduct(productUrl: string, brand: string) {
  if (!productUrl) return;

  try {
    connectToDB();

    const scrapedProduct = await scrapeAmazonProduct(productUrl, brand);

    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}
export async function scrapeAndStoreEbayProduct(
  productUrl: string,
  brand: string
) {
  if (!productUrl) return;

  try {
    connectToDB();

    const scrapedProduct = await scrapeEbayProduct(productUrl, brand);

    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();

    const product = await Product.findOne({ _id: productId });

    if (!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();

    const products = await Product.find();

    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    const product = await Product.findById(productId);

    if (!product) return;

    const userExists = product.users.some(
      (user: User) => user.email === userEmail
    );

    if (!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}

// pages/api/extract-feedback.ts

export async function extractFeedbacks(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = req.body.url; // Expecting URL to be sent in the request body

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    // Fetch the "See all feedback" page HTML
    const response = await fetch(url);
    const feedbackPageHtml = await response.text();
    const $feedbackPage = cheerio.load(feedbackPageHtml);

    // Extract feedback table data
    const feedbacks = $feedbackPage("#feedback-cards tr")
      .map((index, element) => {
        const comment = $feedbackPage(element)
          .find(".card__comment span")
          .text()
          .trim();
        const user = $feedbackPage(element).find(".card__from a").text().trim();
        const rating = $feedbackPage(element)
          .find('.card__from a[data-test-id="fdbk-rating-score-1"]')
          .text()
          .trim();
        const price = $feedbackPage(element)
          .find('.card__price span[data-test-id="fdbk-price-1"]')
          .text()
          .trim();
        const time = $feedbackPage(element)
          .find('td div span[data-test-id="fdbk-time-1"]')
          .text()
          .trim();
        const verified = $feedbackPage(element)
          .find("td div span")
          .text()
          .includes("Verified purchase")
          ? "Verified purchase"
          : "";

        return {
          comment,
          user,
          rating,
          price,
          time,
          verified,
        };
      })
      .get();

    // Extract pagination data
    const maxItemsPerPage = $feedbackPage(
      '.itemsPerPage .item[selected="true"]'
    )
      .text()
      .trim();

    res.status(200).json({
      feedbacks,
      maxItemsPerPage,
    });
  } catch (error) {
    console.error("Failed to fetch or parse feedback page:", error);
    res.status(500).json({ error: "Failed to fetch or parse feedback page" });
  }
}
