import React, { useState, useEffect } from "react";
import axios from "axios";
import { decode } from "he";
import MyButton from "./MyButton";

const GamePlay = ({
  categories,
  setCategories,
  inviteeName,
  setInviteeName,
  invitedPlayers,
  setInvitedPlayers,
  isReady,
  setIsReady,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
}) => {
  const [triviaData, setTriviaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  //   const [category, setCategory] = useState("");
  //   const [difficulty, setDifficulty] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryDelayMs = 3000;

  useEffect(() => {
    console.log(
      "selectedCategory: ",
      selectedCategory,
      "selectedDifficulty: ",
      selectedDifficulty
    );
  }, []);

  const fetchTrivia = async () => {
    // e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      console.log("selectedCategory: ", selectedCategory);
      const url =
        process.env.NODE_ENV === "development"
          ? `https://opentdb.com/api.php?amount=10${
              selectedCategory !== "" ? `&category=${selectedCategory}` : ""
            }${
              selectedDifficulty !== ""
                ? `&difficulty=${selectedDifficulty}`
                : ""
            }`
          : ``;
      // : `https://mern-expense-tracker-production-b291.up.railway.app/api/subcategories`;
      // : `https://mern-expense-tracker.fly.dev/api/subcategories`;
      const res = await axios.get(url);
      setTriviaData(res.data);
      setRetryCount(0);
      console.log("url: ", url);
    } catch (err) {
      console.error("Failed to fetch trivia questions", err);
      setError(err);
      if (err.response?.status === 429 && retryCount < maxRetries) {
        console.log(
          `Rate limited. Retrying in ${
            retryDelayMs / 1000
          } seconds... (Attempt ${retryCount + 1}/${maxRetries})`
        );
        setTimeout(fetchTriviaWithRetry, retryDelayMs);
        setRetryCount((prevCount) => prevCount + 1);
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTriviaWithRetry();
    // console.log("fetch: ", triviaData);
  }, []);

  useEffect(() => {
    console.log("triviaData in component:", triviaData);
  }, [triviaData]);

  const fetchTriviaWithRetry = () => {
    fetchTrivia();
  };

  useEffect(() => {
    if (triviaData?.results) {
      const allOptions = triviaData.results.map((item) => {
        const incorrectAnswers = item.incorrect_answers.map(decode);
        const correctAnswer = decode(item.correct_answer);
        const all = [...incorrectAnswers, correctAnswer];
        // Simple Fisher-Yates shuffle to randomize the order
        for (let i = all.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [all[i], all[j]] = [all[j], all[i]];
        }
        return all;
      });
      setOptions(allOptions);
    }
  }, [triviaData]);

  if (error) {
    return <div>Error loading trivia: {error.message}</div>;
  }

  if (triviaData === null) {
    return <div>Loading trivia questions...</div>;
  }

  return (
    <div className="text-center">
      <br />
      <br />
      {loading && <p>Loading data...</p>}

      <br />
      <br />
      {triviaData?.results?.map((item, index) => (
        <div key={index}>
          <p>Question: {decode(item.question)}</p>
          <div>
            {options[index]?.map((option, optionIndex) => (
              <span key={optionIndex}>
                <button
                  onClick={(e) => {
                    if (e.target.textContent === decode(item.correct_answer)) {
                      //   alert("Corrent!!!");
                    } else {
                      alert("Incorrect");
                    }
                    // setClicked(true);
                  }}
                >
                  <span>{option}</span>
                </button>
                <br />
              </span>
            ))}
          </div>
          <br />
          {/* correct anwser: {item.correct_answer} <br /> */}
          <br />
        </div>
      ))}
    </div>
  );
};

export default GamePlay;
