import React, { useEffect, useState, useRef } from "react";

const ProgressBar = () => {
  const [width, setWidth] = useState(100);
  const [points, setPoints] = useState(1000);
  const [collapsing, setCollapsing] = useState(false);
  //   const intervalRef = useRef(null);
  const progressBarInnerRef = useRef(null);

  useEffect(() => {
    const startCollapse = setTimeout(() => {
      setCollapsing(true);
    }, 3000);

    const updateWidth = () => {
      if (progressBarInnerRef.current) {
        const currentWidth = progressBarInnerRef.current.offsetWidth;
        const parentWidth =
          progressBarInnerRef.current.parentNode?.offsetWidth || 1; // Avoid division by zero
        const percentageWidth = (currentWidth / parentWidth) * 100;
        setWidth(Math.max(0, Math.min(100, Math.round(percentageWidth)))); // Update state as percentage
      }
    };

    let animationFrameId;

    const animationCallback = () => {
      updateWidth();
      animationFrameId = requestAnimationFrame(animationCallback);
    };

    if (collapsing && progressBarInnerRef.current) {
      animationFrameId = requestAnimationFrame(animationCallback);
    }

    return () => {
      clearTimeout(startCollapse);
      cancelAnimationFrame(animationFrameId);
    };
  }, [collapsing]);

  useEffect(() => {
    // Update points based on the width state
    setPoints(Math.round(width * 10));
  }, [width]);

  //   const points = Math.round(width * 10);

  return (
    <div className="text-center">
      <div className="flex justify-center ">
        {" "}
        <div>
          <span className="progress-bar-outer">
            <span
              ref={progressBarInnerRef}
              className={`progress-bar-inner ${collapsing && "collapse-width"}`}
              style={{ width: `${width}%` }}
            ></span>
          </span>
        </div>
        <br />
      </div>
      <div>POINTS: {points}</div>
    </div>
  );
};

export default ProgressBar;
