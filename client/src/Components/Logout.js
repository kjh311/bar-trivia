import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../Zustand/store";

const Logout = () => {
  const loggedIn = useUserStore((state) => state.loggedIn);
  const navigate = useNavigate();
  const logOut = useUserStore((state) => state.logOut);
  const path = window.location.pathname;

  console.log("Path: ", path);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("Bar-Trivia-Token");
    // localStorage.removeItem("Bar-Trivia-Username"); // Remove username if stored
    logOut();

    // Navigate the user to the login page
    navigate("/login");
  };

  // You can render a button or trigger this function in another way
  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      {loggedIn
        ? "Logout"
        : path === "/login"
        ? "Register"
        : path === "/register"
        ? "Login"
        : ""}
    </button>
  );
};

export default Logout;
