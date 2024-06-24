import { useState } from "react";
import "../styles/HamburgerMenu.css";
import { usePathname } from "next/navigation";

interface HamburgerMenuProps {
  navItems: Array<{ href: string; title: string }>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HamburgerMenu = ({
  navItems,
  isOpen,
  setIsOpen,
}: HamburgerMenuProps) => {
  const pathname = usePathname();

  const HamburgerIcon = () => (
    <div className="p-1/2">
      <svg
        className="w-12 h-12 text-white"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </div>
  );

  const smoothScrollToElement = (selector: string) => {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const handleNavItemClick = (selector: string) => {
    smoothScrollToElement(selector);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`hamburger-menu ${isOpen ? "open hamburger-menu-open" : ""}`}
      >
        <HamburgerIcon />
      </button>
      {/* Mobile nav menu */}
      <nav className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <ul>
          {navItems.map(({ href, title }, index) => (
            <li key={index}>
              <a
                key={index}
                href={href}
                className={`mobile-menu-item hover:underline underline-offset-4 transition-all duration-150 mt-2 menu-item ${pathname.startsWith(href) ? "underline" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavItemClick(href);
                }}
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
