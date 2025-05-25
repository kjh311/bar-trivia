import { create } from "zustand";

// FIX: Added 'get' as the second parameter here
export const useUserStore = create((set, get) => {
  return {
    // Improvement: Ensure || "" is applied to the result of getItem
    userName: localStorage.getItem("Bar-Trivia-Username") || "",
    totalUserScore: 0,
    addPointsToTotalUserScore: (points) =>
      set((state) => ({ totalUserScore: state.totalUserScore + points })),
    resetTotalUserScore: () => set({ totalUserScore: 0 }),
    highScore: localStorage.getItem("Bar-Trivia-User-High-Score") || 0, // Added || 0 for initial number value
    loggedIn: localStorage.getItem("Bar-Trivia-LoggedIn") === "true",
    logIn: () => {
      // 1. Update the Zustand state
      set({ loggedIn: true });
      // 2. Perform the side effect to localStorage. Remember to store a string!
      localStorage.setItem("Bar-Trivia-LoggedIn", "true");
      console.log("User logged in. State and localStorage updated.");
    },
    logOut: () => {
      // 1. Update the Zustand state
      set({ loggedIn: false });
      // 2. Perform the side effect to localStorage. Best to remove the item or set it to "false".
      localStorage.removeItem("Bar-Trivia-LoggedIn"); // Clears the item from localStorage
      // Or you could set it to "false": localStorage.setItem("Bar-Trivia-LoggedIn", "false");
      console.log("User logged out. State and localStorage updated.");
      // You might also want to clear other user-specific data on logout
      // set({ userName: "", totalUserScore: 0, highScore: 0 });
      localStorage.removeItem("Bar-Trivia-Username");
      localStorage.removeItem("Bar-Trivia-User-High-Score");
    },

    // Action to update high score based on current game score
    updateHighScore: () => {
      // 'get()' is now correctly accessible
      const currentTotalScore = get().totalUserScore;
      // Important: localStorage values are strings, convert to number for Math.max
      const currentHighScore = Number(get().highScore);

      const newHighScore = Math.max(currentTotalScore, currentHighScore);

      if (newHighScore > currentHighScore) {
        set({ highScore: newHighScore });
        // It's a good practice to also update localStorage when high score changes
        localStorage.setItem(
          "Bar-Trivia-User-High-Score",
          newHighScore.toString()
        );
        console.log("Zustand: New High Score set from game:", newHighScore);
      } else {
        console.log(
          "Zustand: No new High Score from game. Current:",
          currentHighScore,
          "Score:",
          currentTotalScore
        );
      }
    },

    // Action: Set High Score directly from an API response
    setHighScoreFromAPI: (apiHighScore) => {
      // Ensure apiHighScore is a number before setting
      const numericApiHighScore = Number(apiHighScore);
      if (
        typeof numericApiHighScore === "number" &&
        !isNaN(numericApiHighScore) &&
        numericApiHighScore >= 0
      ) {
        set({ highScore: numericApiHighScore });
        // Also update localStorage if this is the source of truth for persistence
        localStorage.setItem(
          "Bar-Trivia-User-High-Score",
          numericApiHighScore.toString()
        );
        console.log("Zustand: High Score set from API:", numericApiHighScore);
      } else {
        console.warn(
          "Zustand: Invalid high score received from API:",
          apiHighScore
        );
      }
    },
  };
});
