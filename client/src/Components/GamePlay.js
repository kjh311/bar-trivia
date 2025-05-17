import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { decode } from "he";
import MyButton from "./MyButton";
import ProgressBar from "./ProgressBar";
import { PointsContext } from "./GameParentComponent";

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
  setAnswered,
  setUserAnswer,
  correctAnswer,
  setCorrectAnswer,
  socket,
  answered,
  roomIdRef,
  playersInRoom,
  currentSocketQuestion,
  userAnswer,
  collapsing,
  setCollapsing,
  totalUserScore,
  setTotalUserScore,
}) => {
  console.log("GamePlay: totalScore:", totalUserScore);
  const [triviaData, setTriviaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [points, setPoints] = useContext(PointsContext);
  const [userScore, setUserScore] = useState(0);
  const [restartProgressBar, setRestartProgressBar] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryDelayMs = 3000;
  const [startProgressBar, setStartProgressBar] = useState(false);

  useEffect(() => {
    fetchTriviaWithRetry();
  }, []);

  useEffect(() => {
    console.log("GamePlay - playersInRoom prop:", playersInRoom);
  }, [playersInRoom]);

  useEffect(() => {
    console.log("triviaData in component:", triviaData);
  }, [triviaData]);

  const fetchTrivia = async () => {
    setLoading(true);
    setError(null);
    try {
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
      const res = await axios.get(url);
      setTriviaData(res.data.results || []); // Ensure it's an array
      setRetryCount(0);
    } catch (err) {
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

  const fetchTriviaWithRetry = () => {
    fetchTrivia();
  };

  useEffect(() => {
    if (triviaData.length > 0 && currentQuestionIndex < triviaData.length) {
      // Check for array length and index
      const currentQuestion = triviaData[currentQuestionIndex];
      const incorrectAnswers =
        currentQuestion?.incorrect_answers?.map(decode) || [];
      const correctAnswer = currentQuestion?.correct_answer
        ? decode(currentQuestion.correct_answer)
        : ""; //handle undefined
      const all = [...incorrectAnswers, correctAnswer].sort(
        () => Math.random() - 0.5
      );
      setOptions(all);
      setCorrectAnswer(correctAnswer);
    }
  }, [triviaData, currentQuestionIndex]);

  useEffect(() => {
    if (restartProgressBar) {
      setTimeout(() => {
        setCollapsing(false);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }, 3000);
    }
  }, [restartProgressBar]);

  const handleAnswer = (selectedAnswer) => {
    if (!answered) {
      setAnswered(true);
      setUserAnswer(selectedAnswer);

      console.log("SetStartProgressBar: ", startProgressBar);

      if (selectedAnswer === correctAnswer) {
        setTotalUserScore((prev) => prev + points);
      }
      setTimeout(() => {
        if (currentQuestionIndex < triviaData.length - 1) {
          console.log("RESTART");
          setAnswered(false);
          setUserAnswer(null);
        } else {
          alert("End of questions!");
        }
      }, 2000);
    }
  };

  if (error) {
    return <div>Error loading trivia: {error.message}</div>;
  }

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (!socket) {
    return <div>Connecting to game...</div>;
  }

  const currentTriviaQuestion = triviaData[currentQuestionIndex];

  return (
    <>
      <div className="text-center">
        <br />
        <br />
        <div>
          <h2>Game Room: {roomIdRef.current}</h2>
          <ul>
            {playersInRoom.map((player) => (
              <li key={player.playerId}>{player.name}</li>
            ))}
          </ul>
          {currentSocketQuestion && (
            <div>
              {/* Render socket-driven question if available */}
              <h3>{decode(currentSocketQuestion.question)}</h3>
              <div>
                {currentSocketQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      /* Handle socket answer */ console.log(option)
                    }
                  >
                    {decode(option)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <h1>Score: {points}</h1>
        <h1>Total Score: {totalUserScore}</h1>

        <br />
        <br />
        {currentTriviaQuestion && (
          <div>
            <h3>
              Question {currentQuestionIndex + 1}:{" "}
              {decode(currentTriviaQuestion.question)}
            </h3>
            <div>
              {options.map((option, optionIndex) => (
                <span key={optionIndex}>
                  <button
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className={`px-4 py-2 rounded m-2 ${
                      answered
                        ? option === correctAnswer
                          ? "bg-green-500 text-white"
                          : option === userAnswer && option !== correctAnswer
                          ? "bg-red-500 text-white"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-700 text-white"
                    }`}
                  >
                    <span>{option}</span>
                  </button>
                  <br />
                </span>
              ))}
            </div>
            {answered && (
              <p>
                {userAnswer === correctAnswer
                  ? "Correct!"
                  : `Incorrect. The correct answer was: ${correctAnswer}`}
              </p>
            )}
          </div>
        )}
      </div>
      <ProgressBar
        collapsing={collapsing}
        setCollapsing={setCollapsing}
        totalUserserScore={totalUserScore}
        setTotalUserScore={setTotalUserScore}
        userScore={userScore}
        setUserScore={setUserScore}
        startProgressBar={startProgressBar}
        setStartProgressBar={setStartProgressBar}
        restartProgressBar={restartProgressBar}
        setRestartProgressBar={setRestartProgressBar}
      />
    </>
  );
};

export default GamePlay;
