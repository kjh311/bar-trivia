import React, { useState, useEffect, useRef } from "react";
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
}) => {
  const [triviaData, setTriviaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  //   const [answered, setAnswered] = useState(false);
  //   const [correctAnswer, setCorrectAnswer] = useState(null);
  //   const [userAnswer, setUserAnswer] = useState(null);
  const [userScore, setUserScore] = useState(0);

  //   const [socket, setSocket] = useState(null);
  //   const [currentSocketQuestion, setCurrentSocketQuestion] = useState(null);
  //   const [playersInRoom, setPlayersInRoom] = useState([]);
  //   const roomIdRef = useRef(null);

  //   const [triviaData, setTriviaData] = useState([]);
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState(null);
  //   const [options, setOptions] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryDelayMs = 3000;

  //   const [socket, setSocket] = useState(null);
  //   const [currentQuestion, setCurrentQuestion] = useState(null);
  //   const [playersInRoom, setPlayersInRoom] = useState([]);
  //   const roomIdRef = useRef(null); // To store the room ID

  //   useEffect(() => {
  //     const newSocket = io("http://localhost:8080");
  //     setSocket(newSocket);
  //     const roomId = `trivia-${Date.now()}-${Math.random()
  //       .toString(36)
  //       .substring(7)}`;
  //     roomIdRef.current = roomId;
  //     newSocket.emit("joinRoom", roomId);
  //     newSocket.on("userJoined", (playerId) => {
  //       setPlayersInRoom((prevPlayers) => [...prevPlayers, playerId]);
  //     });
  //     newSocket.on("newQuestion", (questionData) => {
  //       setCurrentSocketQuestion(questionData);
  //       setAnswered(false);
  //       setCorrectAnswer(null);
  //       setUserAnswer(null);
  //     });
  //     return () => {
  //       newSocket.disconnect();
  //     };
  //   }, []);

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
    if (triviaData.length > 0) {
      const currentQuestion = triviaData[currentQuestionIndex];
      const incorrectAnswers =
        currentQuestion?.incorrect_answers?.map(decode) || [];
      const correctAnswer = decode(currentQuestion?.correct_answer) || "";
      const all = [...incorrectAnswers, correctAnswer].sort(
        () => Math.random() - 0.5
      );
      setOptions(all);
      setCorrectAnswer(correctAnswer);
    }
  }, [triviaData, currentQuestionIndex]);

  const handleAnswer = (selectedAnswer) => {
    if (!answered) {
      setAnswered(true);
      setUserAnswer(selectedAnswer);
      // In a real game, you'd likely send this to the server
      // and wait for confirmation before moving to the next question

      if (selectedAnswer === correctAnswer) {
        setUserScore((prev) => prev + 1);
        // In a real game, you'd likely send this to the server
        // and wait for confirmation before moving to the next question
      }
      setTimeout(() => {
        if (currentQuestionIndex < triviaData.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setAnswered(false);
          setUserAnswer(null);
        } else {
          alert("End of questions!");
          // Optionally navigate to a results screen
        }
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
                  onClick={() => /* Handle socket answer */ console.log(option)}
                >
                  {decode(option)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <h1>Score: {userScore}</h1>

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
  );
};

export default GamePlay;
