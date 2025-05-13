import "./Stylesheets/App.css";
import TriviaTest from "./Components/TriviaTest";
import ChatTest from "./Components/ChatTest";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./Components/RegisterForm";
import LoginForm from "./Components/LoginForm";

function App() {
  return (
    <div className="App">
      <Router>
        {/* <TriviaTest /> */}
        <Routes>
          <Route exact path="/register" element={<RegisterForm />} />
          <Route exact path="/login" element={<LoginForm />} />

          {/* <ChatTest /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
