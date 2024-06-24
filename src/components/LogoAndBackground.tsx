import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function LogoAndBackground() {
  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    const isSafariBrowser = navigator.vendor?.indexOf('Apple') > -1;
    setIsSafari(isSafariBrowser);
  }, []);

  return (
    <>
      {isSafari ? (
        <style jsx global>
          {`
            body:after {
              content: "";
              position: fixed;
              top: 0;
              height: 100vh; /* fix for mobile browser address bar appearing and disappearing */
              left: 0;
              right: 0;
              z-index: -1;
              background: url('/img/background4.jpg') center center;
              -webkit-background-size: cover;
              -moz-background-size: cover;
              -o-background-size: cover;
              background-size: cover;
              background-attachment: scroll;
            }
          `}
        </style>
      ) : (
        <style jsx global>
          {`
            body {
              background-image: url('/img/background4.jpg');
              background-size: cover;
              background-repeat: no-repeat;
              background-attachment: fixed;
              background-position: top center;
            }
          `}
        </style>
      )}
      {<style jsx>{`
        @keyframes bounce {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>}
      <div className="flex justify-center mt-16 mb-4">
        <Image src="/img/moonmouse-big-text.png" width="240" height="135" alt="MMOUSE" />
      </div>
    </>
  )
}
