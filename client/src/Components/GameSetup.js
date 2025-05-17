import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

const GameSetup = ({
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
  userName,
  points,
  setPoints,
  collapsing,
  setCollapsing,
}) => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  // Simulate fetching categories from an API
  useEffect(() => {
    // Replace this with your actual API call
    const fetchCategories = async () => {
      try {
        // Example data
        const data = [
          { id: 9, name: "General Knowledge" },
          { id: 10, name: "Books" },
          { id: 11, name: "Film" },
          { id: 12, name: "Music" },
          { id: 13, name: "Musicals & Theatres" },
          { id: 14, name: "Television" },
          { id: 15, name: "Video Games" },
          { id: 16, name: "Board Games" },
          { id: 17, name: "Science & Nature" },
          { id: 18, name: "Computers" },
          { id: 19, name: "Mathematics" },
          { id: 20, name: "Mythology" },
          { id: 21, name: "Sports" },
          { id: 22, name: "Geography" },
          { id: 23, name: "History" },
          { id: 24, name: "Politics" },
          { id: 25, name: "Art" },
          { id: 26, name: "Celebrities" },
          { id: 27, name: "Animals" },
          { id: 28, name: "Vehicles" },
          { id: 29, name: "Comics" },
          { id: 30, name: "Gadgets" },
          { id: 31, name: "Japanese Anime & Manga" },
          { id: 32, name: "Cartoon & Animations" },
        ];
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorMessage("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    console.log(
      "selectedCategory: ",
      selectedCategory,
      "selectedDifficulty: ",
      selectedDifficulty
    );
  }, [selectedCategory, selectedDifficulty]);

  const handleInvitePlayer = () => {
    if (inviteeName.trim() && !invitedPlayers.includes(inviteeName.trim())) {
      setInvitedPlayers([...invitedPlayers, inviteeName.trim()]);
      setInviteeName("");
      setErrorMessage("");
    } else if (invitedPlayers.includes(inviteeName.trim())) {
      setErrorMessage("Player already invited.");
    } else {
      setErrorMessage("Please enter a player name to invite.");
    }
  };

  const handleRemoveInvite = (playerName) => {
    setInvitedPlayers(invitedPlayers.filter((name) => name !== playerName));
  };

  const handleReady = () => {
    if (selectedCategory && selectedDifficulty) {
      setIsReady(true);
      // In a real application, you might want to send this setup data
      // to your backend to initialize the game with these settings
      console.log("Game setup:", {
        category: selectedCategory,
        difficulty: selectedDifficulty,
        players: [...invitedPlayers, "You"],
      });
      // Navigate to the game component
      //   navigate("/gamePlay"); // Replace '/game' with the actual path to your game component
    } else {
      setErrorMessage(
        "Please select a category and difficulty before starting."
      );
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Game Setup
        </h2>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Category:
          </label>
          <select
            id="category"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="difficulty"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Difficulty:
          </label>
          <select
            id="difficulty"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
          >
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Invite Players
          </h3>
          <div className="flex items-center mb-2">
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              placeholder="Player Name"
              value={inviteeName}
              onChange={(e) => setInviteeName(e.target.value)}
            />
            <button
              type="button"
              onClick={handleInvitePlayer}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Invite
            </button>
          </div>
          {invitedPlayers.length > 0 && (
            <div className="mt-2">
              <ul className="list-disc list-inside text-gray-700">
                {invitedPlayers.map((player) => (
                  <li
                    key={player}
                    className="flex items-center justify-between py-1"
                  >
                    {player}
                    <button
                      type="button"
                      onClick={() => handleRemoveInvite(player)}
                      className="bg-red-300 hover:bg-red-400 text-red-800 font-semibold py-1 px-2 rounded-full focus:outline-none focus:shadow-outline text-xs"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={handleReady}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline w-full"
        >
          Start Game
        </button>
      </div>
      {/* <ProgressBar /> */}
    </div>
  );
};

export default GameSetup;
