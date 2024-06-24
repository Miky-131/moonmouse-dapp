"use client"
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="flex justify-center items-center py-4 bg-[#3a254ddd] text-white w-[110vw] -ml-[10vw] backdrop-blur-md mt-32">
      <div className="text-center">
        <p className="text-white">© 2024 Moon Mouse</p>
        <p className="text-white">All Rights Reserved</p>
      </div>
    </footer>
  );
}
