import React, { useContext, useState } from "react";
import "./Stylesheets/App.css";
import ChatTest from "./Components/ChatTest";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./Components/RegisterForm";
import LoginForm from "./Components/LoginForm";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import GameParentComponent from "./Components/GameParentComponent";
import GamePlay from "./Components/GamePlay";
import AfterGame from "./Components/AfterGame";

// export const PointsContext = React.createContext();
export const UserNameContext = React.createContext();
export const HighScoreContext = React.createContext();
export const TotalScoreContext = React.createContext();

function App() {
  const [totalUserScore, setTotalUserScore] = useState(0); // Global score
  const [highScore, setHighScore] = useState(0); // Global high score
  const [userName, setUserName] = useState(
    localStorage.getItem("Bar-Trivia-Username" || "")
  );
  const [points, setPoints] = useState(1000);

  return (
    <div className="App">
      <HighScoreContext.Provider value={[highScore, setHighScore]}>
        <TotalScoreContext.Provider value={[totalUserScore, setTotalUserScore]}>
          <UserNameContext.Provider value={[userName, setUserName]}>
            <Router>
              <Navbar />
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/register" element={<RegisterForm />} />
                <Route exact path="/login" element={<LoginForm />} />
                <Route
                  exact
                  path="/gameParent"
                  element={
                    <ProtectedRoute>
                      <GameParentComponent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/afterGame"
                  element={
                    <ProtectedRoute>
                      <AfterGame />
                    </ProtectedRoute>
                  }
                />

                {/* <ChatTest /> */}
              </Routes>
            </Router>
          </UserNameContext.Provider>
        </TotalScoreContext.Provider>
      </HighScoreContext.Provider>
    </div>
  );
}

export default App;
