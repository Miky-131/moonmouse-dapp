import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const ButtonApp: React.FC<Props> = ({ children, className, onClick }) => {
  return (
    <button
      className={`rounded-full border-0 w-40 h-10 ${className} -mx-4`}
      onClick={onClick}
      style={{
        background: `url(/img/button.png) no-repeat center`,
        backgroundSize: "contain",
      }}
    >
      <span
        className={`text-white font-semibold hover:underline hover:underline-offset-4`}
      >
        {children}
      </span>
    </button>
  );
};

export default ButtonApp;
