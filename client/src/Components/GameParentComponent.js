import React, { useContext, useState, useEffect } from "react";
import GameSetup from "./GameSetup";
// import TriviaTest from "./TriviaTest";
import GamePlay from "./GamePlay";

const GameParentComponent = () => {
  const [inviteeName, setInviteeName] = useState("");
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

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
        />
      )}
    </div>
  );
};

export default GameParentComponent;
