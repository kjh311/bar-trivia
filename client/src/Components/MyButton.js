import React, { useState } from "react";

function MyButton() {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    // Optionally, you might want to reset the state after a short delay
    // setTimeout(() => setIsPressed(false), 100); // Example: Briefly show red
    // Perform your button's action here
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: isPressed ? "red" : "blue", // Default blue
    color: "white",
    border: "none",
    cursor: "pointer",
  };

  return (
    <button style={buttonStyle} onClick={handleClick}>
      Click Me
    </button>
  );
}

export default MyButton;
