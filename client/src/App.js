import React from "react";
import "./Stylesheets/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./Components/RegisterForm";
import LoginForm from "./Components/LoginForm";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import GameParentComponent from "./Components/GameParentComponent";
import AfterGame from "./Components/AfterGame";

function App() {
  return (
    <div className="App">
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
