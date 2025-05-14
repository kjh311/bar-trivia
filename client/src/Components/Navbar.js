import React, { useContext } from "react";
import { UserNameContext } from "../App";
import Logout from "./Logout";

const Navbar = () => {
  const [userName, setUserName] = useContext(UserNameContext);

  return (
    <div className="flex justify-evenly items-center text-center w-full bg-blue-300 h-10 top-0 fixed">
      <p>Welcome {userName}</p>
      <Logout />
    </div>
  );
};

export default Navbar;
