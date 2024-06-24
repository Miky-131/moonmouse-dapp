"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ButtonApp from "./ButtonApp";
import styles from "../styles/Hero.module.css";
import "../styles/HamburgerMenu.css";
import { HamburgerMenu } from "./HamburgerMenu";
import WalletWidget from './navWidgets/WalletWidget'

export default function Header() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const smoothScrollToElement = (selector: string) => {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const navItems = [
    {
      href: "https://moonmouse.io",
      title: "HOME",
    },
    {
      href: "/swap",
      title: "SWAP",
    },
    {
      href: "/liquidity/add",
      title: "LIQUIDITY",
    },
    {
      href: "/staking",
      title: "STAKING",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Hide mobile menu when a link is clicked
    const links = document.querySelectorAll(".mobile-menu a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        setIsOpen(false);
      });
    });
  }, []);

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        mobileMenuRef.current &&
        !event.target.matches(".hamburger-menu") &&
        !event.target.matches(".mobile-menu a") &&
        !event.target.matches(".mobile-menu") &&
        !event.target.matches(".hamburger-menu-open")
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="flex justify-between items-center px-8 py-2 bg-purple-900/20 text-white w-full backdrop-blur-md fixed z-20">
        <div className="lg:hidden">
          <Link href="/">
            <Image src="/img/moonmouse.png" width={44} height={44} alt="Logo" />
          </Link>
        </div>
        <div className="hidden lg:block">
          <Link href="https://moonmouse.io">
            <Image
              src="/img/moonmouse-text.png"
              width={300}
              height={150}
              alt="Logo"
            />
          </Link>
        </div>
        {/* 
            In case you need to mark a page as coming soon, you can replae <a> tag with
            a button and use this function to show "Coming Soon" modal:
            onClick={() => {
              setIsModalOpen(true);
            }}
        */}
        <nav className="flex space-x-4 lg:space-x-8">
          <a
            href="https://moonmouse.io"
            className="hover:underline hover:underline-offset-4 transition-all duration-150 hidden lg:block mt-5 menu-item"
          >
            HOME
          </a>
          <a
            href="/swap"
            className={`hover:underline underline-offset-4 transition-all duration-150 hidden lg:block mt-5 menu-item ${pathname.startsWith("/swap") ? "underline" : ""}`}
          >
            SWAP
          </a>
          <a
            href="/liquidity/add"
            className={`hover:underline underline-offset-4 transition-all duration-150 hidden lg:block mt-5 menu-item ${pathname.startsWith("/liquidity") ? "underline" : ""}`}
          >
            LIQUIDITY
          </a>
          <a
            href="/staking"
            className={`hover:underline underline-offset-4 transition-all duration-150 hidden lg:block mt-5 menu-item ${pathname.startsWith("/staking") ? "underline" : ""}`}
          >
            STAKING
          </a>
          <WalletWidget />
          <div ref={mobileMenuRef}>
            <HamburgerMenu
              navItems={navItems}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </div>
        </nav>
      </header>
      {/* Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-20 p-10">
          <div className="bg-[#331177ee] p-6 rounded-lg w-full max-w-xl">
            <Image
              src="/img/moonmouse.png"
              width={128}
              height={128}
              alt="Logo"
              className="text-center mx-auto"
            />
            <p className="text-3xl font-bold text-center">Coming Soon!</p>
            <div className="flex justify-center items-center mt-4">
              <ButtonApp
                onClick={closeModal}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg"
              >
                Close
              </ButtonApp>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
