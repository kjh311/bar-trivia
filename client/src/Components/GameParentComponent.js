import React, { useContext, useState, useEffect, useRef } from "react";
import GameSetup from "./GameSetup";
// import TriviaTest from "./TriviaTest";
import GamePlay from "./GamePlay";
import { io } from "socket.io-client";
import { UserNameContext } from "../App";
// import ProgressBar from "./ProgressBar";

const GameParentComponent = () => {
  const [inviteeName, setInviteeName] = useState("");
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const [socket, setSocket] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [playersInRoom, setPlayersInRoom] = useState([]);
  const roomIdRef = useRef(null); // To store the room ID
  const [currentSocketQuestion, setCurrentSocketQuestion] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [userName, setUserName] = useContext(UserNameContext);

  const [points, setPoints] = useState(1000);
  const [collapsing, setCollapsing] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);
    // const roomId = `trivia-${Date.now()}-${Math.random()
    //   .toString(36)
    //   .substring(7)}`;
    // roomIdRef.current = roomId;
    // newSocket.emit("joinRoom", roomId);
    // const currentUsername = userName; // Replace with your actual username

    const roomId = "test-room"; // Temporarily hardcoded
    roomIdRef.current = roomId;
    // newSocket.emit("joinRoom", { roomId, name: currentUsername });

    console.log("Connecting socket with ID:", newSocket.id);

    // newSocket.emit("joinRoom", { roomId, name: currentUsername });

    // Immediately add the current user to playersInRoom
    setPlayersInRoom([{ playerId: newSocket.id, name: userName }]);

    newSocket.on("userJoined", (data) => {
      console.log("Received userJoined:", data);
      setPlayersInRoom((prevPlayers) => {
        if (!prevPlayers.find((p) => p.playerId === data.playerId)) {
          return [...prevPlayers, { playerId: data.playerId, name: data.name }];
        }
        return prevPlayers;
      });
    });

    newSocket.on("existingUsers", (users) => {
      console.log("Received existingUsers:", users);
      setPlayersInRoom(users);
      console.log("playersInRoom after existingUsers:", playersInRoom);
    });

    newSocket.on("userLeft", (data) => {
      setPlayersInRoom((prevPlayers) =>
        prevPlayers.filter((player) => player.playerId !== data.playerId)
      );
      console.log("Received userLeft:", data);
    });

    newSocket.on("newQuestion", (questionData) => {
      setCurrentSocketQuestion(questionData);
      setAnswered(false);
      setCorrectAnswer(null);
      setUserAnswer(null);
    });

    return () => {
      if (socket) {
        console.log("Socket disconnected"); // Add this log
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    console.log("playersInRoom after userJoined:", playersInRoom);
  }, [playersInRoom]);

  return (
    <div>
      {!isReady ? (
        <GameSetup
          categories={categories}
          setCategories={setCategories}
          inviteeName={inviteeName}
          setInviteeName={setInviteeName}
          invitedPlayers={invitedPlayers}
          setInvitedPlayers={setInvitedPlayers}
          isReady={isReady}
          setIsReady={setIsReady}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          points={points}
          setPoints={setPoints}
          collapsing={collapsing}
          setCollapsing={setCollapsing}
        />
      ) : (
        <GamePlay
          categories={categories}
          setCategories={setCategories}
          inviteeName={inviteeName}
          setInviteeName={setInviteeName}
          invitedPlayers={invitedPlayers}
          setInvitedPlayers={setInvitedPlayers}
          isReady={isReady}
          setIsReady={setIsReady}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          setAnswered={setAnswered}
          setUserAnswer={setUserAnswer}
          correctAnswer={correctAnswer}
          setCorrectAnswer={setCorrectAnswer}
          socket={socket}
          answered={answered}
          roomIdRef={roomIdRef}
          playersInRoom={playersInRoom}
          currentSocketQuestion={currentQuestion}
          userAnswer={userAnswer}
          points={points}
          setPoints={setPoints}
          collapsing={collapsing}
          setCollapsing={setCollapsing}
          //   playersInRoom={playersInRoom}
        />
      )}
    </div>
  );
};

export default GameParentComponent;
