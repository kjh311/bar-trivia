import React, { useState, useEffect } from "react";
import axios from "axios";

const TriviaTest = () => {
  const [data, setData] = useState([]);

  const fetchTrivia = async () => {
    try {
      const res = await axios.get(`https://opentdb.com/api.php?amount=10`);
      console.log(res.data);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch trivia questions", err);
    }
  };

  //   useEffect(() => {
  //     fetchTrivia();
  //   console.log("Fetching Questions")
  //   }, []);

  return (
    <div>
      <h1 className="text-center text-2xl">Hello world!</h1>
    </div>
  );
};

export default TriviaTest;
