import React, { useContext } from "react";
// import { PointsContext } from "../App";
import { Link } from "react-router-dom";
import { HighScoreContext, TotalScoreContext } from "../App";

const AfterGame = () => {
  //   const [points, setPoints] = useContext(PointsContext);
  const [highScore, setHighScore] = useContext(HighScoreContext);
  const [totalUserScore, setTotalUserScore] = useContext(TotalScoreContext);

  //   const handleResetUserScore = () => {
  //     setTotalUserScore(0);
  //   };

  return (
    <div className="text-center">
      <br />
      <br />
      <br />
      <br />
      <h3>Your Score: {totalUserScore}!!</h3>
      <h3>Your High Score: {highScore}!!</h3>
      <br />
      {/* Try again? */}
      <Link
        // onClick={handleResetUserScore}
        className="p-2 m-2 bg-blue-200"
        to={"../gameParent"}
      >
        Try Again?
      </Link>
    </div>
  );
};

export default AfterGame;
