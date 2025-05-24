import React, { useEffect } from "react";
// import { UserNameContext } from "../App";
import Logout from "./Logout";
import { useUserStore } from "../Zustand/store";

const Navbar = () => {
  // const [userName, setUserName] = useContext(UserNameContext);
  const userName = useUserStore((state) => state.userName);
  const loggedIn = useUserStore((state) => state.loggedIn);
  // const token = localStorage.getItem("Bar-Trivia-Token");

  useEffect(() => {
    console.log("logged In: ", loggedIn);
  }, [loggedIn]);

  return (
    <div className="flex justify-evenly items-center text-center w-full bg-blue-300 h-10 top-0 fixed">
      <p>Welcome {loggedIn && userName}</p>
      <Logout />
    </div>
  );
};

export default Navbar;
