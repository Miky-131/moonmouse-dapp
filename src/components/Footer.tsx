"use client"
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from './Button2'
import styles from "./Hero.module.css";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="flex justify-center items-center pb-4 bg-[#3a254ddd] text-white w-[110vw] -ml-[10vw] backdrop-blur-md mt-32">
      <div className="text-center">
        <div className={`${styles.buttonContainer} flex flex-row`}>
          <a href="https://t.me/moonmousecoin" target="_blank" rel="noreferrer">
            <Button className={`${styles.button} ${styles.buttonShadow}`}>
              <div className="flex ml-[32px]">
                <img src="/img/telegram-icon.svg" width="32px" className="mr-2" />
                Telegram
              </div>
            </Button>
          </a>
          <a href="https://x.com/Moonmouse20" target="_blank" rel="noreferrer">
            <Button className={`${styles.button} ${styles.buttonShadow}`}>
              <div className="flex ml-[42px]">
                <img src="/img/x-icon.svg" width="32px" className="mr-2" />
                Twitter
              </div>
            </Button>
          </a>
        </div>
        <br />
        <p className="text-white">© 2024 Moon Mouse</p>
        <p className="text-white">All Rights Reserved</p>
      </div>
    </footer>
  );
}
