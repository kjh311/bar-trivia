import React, { useContext } from "react";
// import { PointsContext } from "../App";
import { Link } from "react-router-dom";

const AfterGame = () => {
  //   const [points, setPoints] = useContext(PointsContext);
  return (
    <div>
      <br />
      <br />
      {/* <h3>Your Points: {points}!!</h3> */}
      <br />
      {/* Try again? */}
      <Link className="p-2 m-2 bg-blue-200" to={"../gameParent"}>
        Try Again?
      </Link>
    </div>
  );
};

export default AfterGame;
