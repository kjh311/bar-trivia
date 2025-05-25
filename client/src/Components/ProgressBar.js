import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react"; // Added useImperativeHandle, forwardRef
// import "./ProgressBar.css";

const ProgressBar = forwardRef(
  (
    {
      // Wrapped in forwardRef
      collapsing,
      setCollapsing,
      restartProgressBar,
      setRestartProgressBar,
    },
    ref
  ) => {
    // Added ref prop
    const [width, setWidth] = useState(100);
    const [displayedPoints, setDisplayedPoints] = useState(1000); // Local state for points display
    const progressBarInnerRef = useRef(null);

    // Expose displayedPoints via imperative handle so GamePlay can read it
    useImperativeHandle(ref, () => ({
      getDisplayedPoints: () => displayedPoints,
      resetProgressBar: () => {
        // Method to be called by GamePlay to reset the bar
        setWidth(100);
        setDisplayedPoints(1000);
        setCollapsing(false);
        setRestartProgressBar(false); // Consume the restart trigger
      },
    }));

    useEffect(() => {
      console.log("ProgressBar: Primary useEffect triggered.");

      // Reset logic when restartProgressBar is true
      if (restartProgressBar) {
        console.log(
          "ProgressBar: Resetting for new question (triggered by GamePlay)."
        );
        // setTimeout(() => {
        setWidth(100); // Reset visual width
        setDisplayedPoints(1000); // Reset local displayed points
        setCollapsing(false); // Ensure animation class is removed
        setRestartProgressBar(false); // Consume the restart trigger
        // }, 3000);
      }

      // Timeout to start the collapse animation after 3 seconds
      const startCollapseTimeout = setTimeout(() => {
        console.log("ProgressBar: Starting collapse animation.");
        setCollapsing(true); // Apply CSS class to start animation
      }, 3000);

      // Function to read current width and update local state
      const updateWidthAndDisplayedPoints = () => {
        if (progressBarInnerRef.current) {
          const currentWidthPx = progressBarInnerRef.current.offsetWidth;
          const parentWidthPx =
            progressBarInnerRef.current.parentNode?.offsetWidth || 1;
          const percentageWidth = (currentWidthPx / parentWidthPx) * 100;

          const newWidth = Math.max(
            0,
            Math.min(100, Math.round(percentageWidth))
          );
          setWidth(newWidth); // Update local width for visual bar

          // Update local displayed points based on current visual width
          const calculatedPoints = Math.round(newWidth * 10);
          setDisplayedPoints(calculatedPoints);

          // When bar reaches 0, signal restart
          if (newWidth === 0) {
            console.log("ProgressBar: Bar reached 0%, triggering restart.");
            setRestartProgressBar(true); // Trigger restart logic in GamePlay for next question
          }
        }
      };

      let animationFrameId;

      // Callback for requestAnimationFrame to continuously update width
      const animationCallback = () => {
        updateWidthAndDisplayedPoints();
        animationFrameId = requestAnimationFrame(animationCallback);
      };

      // Start requestAnimationFrame loop only when collapsing is true and ref is available
      if (collapsing && progressBarInnerRef.current) {
        console.log("ProgressBar: RequestAnimationFrame loop started.");
        animationFrameId = requestAnimationFrame(animationCallback);
      }

      // Cleanup function for useEffect
      return () => {
        console.log("ProgressBar: Cleanup function running.");
        clearTimeout(startCollapseTimeout);
        cancelAnimationFrame(animationFrameId);
      };
    }, [collapsing, restartProgressBar, setCollapsing, setRestartProgressBar]); // Dependencies updated

    // This useEffect is for logging and can be kept or removed for production
    useEffect(() => {
      console.log("ProgressBar: restartProgressBar state:", restartProgressBar);
    }, [restartProgressBar]);

    return (
      <div className="text-center">
        <div className="flex justify-center ">
          {" "}
          <div>
            <span className="progress-bar-outer">
              <span
                ref={progressBarInnerRef}
                className={`progress-bar-inner ${
                  collapsing && "collapse-width"
                }`}
                style={{ width: `${width}%` }} // Use local 'width' for visual bar
              ></span>
            </span>
          </div>
          <br />
        </div>
        <div>POINTS: {displayedPoints}</div>{" "}
        {/* Display local 'displayedPoints' */}
      </div>
    );
  }
); // End of forwardRef

export default ProgressBar;
