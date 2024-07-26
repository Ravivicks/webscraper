"use client";
import React, { FormEvent } from "react";

const Newsletter = () => {
  const [searchPrompt, setSearchPrompt] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    alert("Thank you");
    setIsLoading(false);
  };
  return (
    <div className="mt-10">
      <h3 className="my-4 text-2xl font-bold">Subscribe Our Newsletter</h3>
      <form className="flex flex-wrap gap-4 w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          placeholder="Enter Email address"
          className="searchbar-input"
        />
        <button
          type="submit"
          className="searchbar-btn"
          disabled={searchPrompt === ""}
        >
          {isLoading ? "Submitting" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
