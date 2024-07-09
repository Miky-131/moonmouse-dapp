import React from "react";

const LoadingAnimation = () => {
  return (
    <div className="loading-container flex flex-col">
      <h1>Loading, please wait...</h1>
      <video
        src="/MoonMousePickingUpCoins.mp4"
        autoPlay
        muted
        loop
        className="loading-animation"
      />
    </div>
  );
};

export default LoadingAnimation;
