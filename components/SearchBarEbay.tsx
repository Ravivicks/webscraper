"use client";

import {
  scrapeAndStoreEbayProduct,
  scrapeAndStoreProduct,
} from "@/lib/actions";
import React, { FormEvent } from "react";

const isValidEbayProductUrl = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;
    if (
      hostname.includes("ebay.com") ||
      hostname.includes("ebay") ||
      hostname.endsWith("ebay")
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

const SearchBarEbay = () => {
  const [searchPrompt, setSearchPrompt] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidLink = isValidEbayProductUrl(searchPrompt);
    if (!isValidLink) return alert("please provide valid ebay link");
    try {
      setIsLoading(true);
      const product = await scrapeAndStoreEbayProduct(searchPrompt, brand);
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="flex flex-wrap gap-4 mt-5 w-full" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter ebay product link"
        className="searchbar-input"
      />
      <input
        type="text"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        placeholder="Enter Brand Name"
        required
        className="searchbar-input"
      />
      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompt === ""}
      >
        {isLoading ? "Searching" : "Search"}
      </button>
    </form>
  );
};

export default SearchBarEbay;
