"use client";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const navIcons = [
  { src: "/assets/icons/search.svg", alt: "search" },
  { src: "/assets/icons/black-heart.svg", alt: "heart" },
];

const Navbar = () => {
  const { user } = useUser();

  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/icons/logo.svg"
            width={27}
            height={27}
            alt="logo"
          />
          <p className="nav-log">
            Web<span className="text-primery"> Scraper</span>
          </p>
        </Link>
        <div className="flex items-center gap-5">
          {navIcons.map((icon) => (
            <Image
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              width={28}
              height={28}
              className="object-contain"
            />
          ))}
          <SignedOut>
            <div className="bg-secondary px-4 py-2 rounded-full text-white">
              <SignInButton />
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />{" "}
            <p className="text-base capitalize">{user?.username}</p>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
