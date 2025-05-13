import React, { useState, useEffect } from "react";
import axios from "axios";
import { decode } from "he";

const TriviaTest = () => {
  const [triviaData, setTriviaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrivia = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`https://opentdb.com/api.php?amount=10`);
      console.log(res.data.results);
      setTriviaData(res.data);
    } catch (err) {
      console.error("Failed to fetch trivia questions", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrivia();
    console.log("Fetching Questions");
  }, []);

  if (loading) {
    return <div>Loading trivia questions...</div>;
  }

  if (error) {
    return <div>Error loading trivia: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-center text-2xl">Trivia Questions</h1>
      <ul>
        {triviaData?.results?.map((item, index) => (
          <li key={index}>
            {decode(item.question)}
            <ul>
              <li>
                <p>
                  * First Incorrect Answer: {decode(item.incorrect_answers[0])}
                </p>{" "}
                {item.incorrect_answers?.length > 1 && (
                  <p>
                    * Second Incorrect Answer:{" "}
                    {decode(item.incorrect_answers[1])}
                  </p>
                )}
                {item.incorrect_answers?.length > 2 && (
                  <p>
                    * Third Incorrect Answer:{" "}
                    {decode(item.incorrect_answers[2])}
                  </p>
                )}
                <p>* Correct Answer: {decode(item.correct_answer)}</p>
              </li>
            </ul>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TriviaTest;
