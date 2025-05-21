import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { decode } from "he";
import MyButton from "./MyButton"; // Assuming this is used elsewhere
import ProgressBar from "./ProgressBar";
// Removed import for PointsContext
import { useNavigate } from "react-router-dom";
import { UserNameContext } from "../App"; // Ensure correct path to context

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
  highScore,
  setHighScore,
}) => {
  console.log("GamePlay: totalScore:", totalUserScore);
  const [triviaData, setTriviaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [currentBarPoints, setCurrentBarPoints] = useState(1000); // Removed this state
  const progressBarRef = useRef(null); // Ref to access ProgressBar's methods/values
  const [userScore, setUserScore] = useState(0); // This seems unused, consider removing if not needed
  const [restartProgressBar, setRestartProgressBar] = useState(false); // State to signal ProgressBar to reset
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryDelayMs = 3000;
  const [startProgressBar, setStartProgressBar] = useState(false); // This state seems unused, consider removing
  const navigate = useNavigate();

  // Fetch trivia on component mount
  useEffect(() => {
    fetchTriviaWithRetry();
    console.log("GamePlay: Initial fetchTriviaWithRetry called.");
  }, []);

  // Update high score when totalUserScore changes
  useEffect(() => {
    setHighScore(Math.max(totalUserScore, highScore));
    console.log(
      "GamePlay: SetHighScore triggered. Current High Score:",
      highScore
    );
  }, [totalUserScore, highScore, setHighScore]); // Added setHighScore to dependencies

  // Log playersInRoom prop
  useEffect(() => {
    console.log("GamePlay: playersInRoom prop updated:", playersInRoom);
  }, [playersInRoom]);

  // Log triviaData state
  useEffect(() => {
    console.log("GamePlay: triviaData state updated:", triviaData);
  }, [triviaData]);

  const fetchTrivia = async () => {
    console.log("GamePlay: fetchTrivia function called.");
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
      setTriviaData(res.data.results || []);
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

  // Process current question and options
  useEffect(() => {
    console.log("GamePlay: Question processing useEffect triggered.");
    if (triviaData.length > 0 && currentQuestionIndex < triviaData.length) {
      const currentQuestion = triviaData[currentQuestionIndex];
      const incorrectAnswers =
        currentQuestion?.incorrect_answers?.map(decode) || [];
      const correctAnswerDecoded = currentQuestion?.correct_answer
        ? decode(currentQuestion.correct_answer)
        : "";
      const allOptions = [...incorrectAnswers, correctAnswerDecoded].sort(
        () => Math.random() - 0.5
      );
      setOptions(allOptions);
      setCorrectAnswer(correctAnswerDecoded);
      setAnswered(false); // Reset answered state for new question
      setUserAnswer(null); // Reset user answer for new question
      setCollapsing(false); // Ensure progress bar is not collapsing initially for new question
      if (progressBarRef.current) {
        progressBarRef.current.resetProgressBar(); // Reset ProgressBar visually and its internal points
      }
    } else if (
      triviaData.length > 0 &&
      currentQuestionIndex >= triviaData.length
    ) {
      // All questions answered
      console.log("GamePlay: All questions answered, navigating to afterGame.");
      alert("End of questions!"); // Use custom modal instead of alert in production
      navigate("../afterGame");
    }
  }, [
    triviaData,
    currentQuestionIndex,
    setAnswered,
    setCorrectAnswer,
    setCollapsing,
    setUserAnswer,
    navigate,
  ]); // Added all dependencies

  // Logic to handle progress bar restart and next question
  useEffect(() => {
    console.log(
      "GamePlay: restartProgressBar useEffect triggered:",
      restartProgressBar
    );
    if (restartProgressBar) {
      // This timeout is now primarily for *delaying* the next question load,
      // as ProgressBar itself handles its visual reset.
      setTimeout(() => {
        console.log("GamePlay: Moving to next question.");
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setRestartProgressBar(false); // Reset this state after handling
      }, 3000); // Give some time before loading next question
    }
  }, [restartProgressBar]); // Dependencies

  const handleAnswer = (selectedAnswer) => {
    console.log("GamePlay: handleAnswer called with:", selectedAnswer);
    if (!answered) {
      setAnswered(true);
      setUserAnswer(selectedAnswer);

      // Get the current points from ProgressBar's ref
      const pointsEarned = progressBarRef.current
        ? progressBarRef.current.getDisplayedPoints()
        : 0;

      if (selectedAnswer === correctAnswer) {
        console.log("GamePlay: Correct answer! Adding points:", pointsEarned);
        setTotalUserScore((prev) => prev + pointsEarned);
      } else {
        console.log("GamePlay: Incorrect answer.");
      }

      // This timeout is for displaying feedback before triggering the next question flow
      setTimeout(() => {
        console.log("GamePlay: Answer feedback displayed.");
      }, 2000); // Show feedback for 2 seconds
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
              <h3>{decode(currentSocketQuestion.question)}</h3>
              <div>
                {currentSocketQuestion.options.map((option, index) => (
                  <button key={index} onClick={() => console.log(option)}>
                    {decode(option)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <h1>
          Score:{" "}
          {progressBarRef.current
            ? progressBarRef.current.getDisplayedPoints()
            : 1000}
        </h1>{" "}
        {/* Display points from ProgressBar's ref */}
        <h1>Total Score: {totalUserScore}</h1>
        <h1>High Score: {highScore}</h1>
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
        ref={progressBarRef} // Pass the ref to ProgressBar
        collapsing={collapsing}
        setCollapsing={setCollapsing}
        startProgressBar={startProgressBar}
        setStartProgressBar={setStartProgressBar}
        restartProgressBar={restartProgressBar}
        setRestartProgressBar={setRestartProgressBar}
        // onPointsUpdateForGamePlay removed
      />
    </>
  );
};

export default GamePlay;
