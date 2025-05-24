import React, { useState, useEffect, useRef } from "react";
import GameSetup from "./GameSetup";
import GamePlay from "./GamePlay";
import { io } from "socket.io-client";
// import { UserNameContext } from "../App"; // Ensure correct path to context
// import AfterGame from "./AfterGame"; // Assuming this is used elsewhere
import { useUserStore } from "../Zustand/store";

const GameParentComponent = () => {
  console.log("Parent Component: Rendered.");
  const [inviteeName, setInviteeName] = useState("");
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const [socket, setSocket] = useState(null);
  const [playersInRoom, setPlayersInRoom] = useState([]);
  const roomIdRef = useRef(null);
  const [currentSocketQuestion, setCurrentSocketQuestion] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const userName = useUserStore((state) => state.userName);

  const [collapsing, setCollapsing] = useState(false); // Controls ProgressBar animation

  useEffect(() => {
    console.log("GameParentComponent: Socket setup useEffect.");
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    const roomId = "test-room"; // Temporarily hardcoded
    roomIdRef.current = roomId;

    console.log(
      "GameParentComponent: Connecting socket with ID:",
      newSocket.id
    );

    // Immediately add the current user to playersInRoom
    setPlayersInRoom([{ playerId: newSocket.id, name: userName }]);

    newSocket.on("userJoined", (data) => {
      console.log("GameParentComponent: Received userJoined:", data);
      setPlayersInRoom((prevPlayers) => {
        if (!prevPlayers.find((p) => p.playerId === data.playerId)) {
          return [...prevPlayers, { playerId: data.playerId, name: data.name }];
        }
        return prevPlayers;
      });
    });

    newSocket.on("existingUsers", (users) => {
      console.log("GameParentComponent: Received existingUsers:", users);
      setPlayersInRoom(users);
    });

    newSocket.on("userLeft", (data) => {
      console.log("GameParentComponent: Received userLeft:", data);
      setPlayersInRoom((prevPlayers) =>
        prevPlayers.filter((player) => player.playerId !== data.playerId)
      );
    });

    newSocket.on("newQuestion", (questionData) => {
      console.log("GameParentComponent: Received newQuestion.");
      setCurrentSocketQuestion(questionData);
      setAnswered(false);
      setCorrectAnswer(null);
      setUserAnswer(null);
    });

    return () => {
      if (newSocket) {
        // Use newSocket directly from this closure
        console.log("GameParentComponent: Socket disconnected in cleanup.");
        newSocket.disconnect();
      }
    };
  }, [userName]); // Added userName to dependencies as it's used in initial player setup

  useEffect(() => {
    console.log(
      "GameParentComponent: playersInRoom state updated:",
      playersInRoom
    );
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
          currentSocketQuestion={currentSocketQuestion} // Corrected from currentQuestion
          userAnswer={userAnswer}
          collapsing={collapsing}
          setCollapsing={setCollapsing}
        />
      )}
    </div>
  );
};

export default GameParentComponent;
