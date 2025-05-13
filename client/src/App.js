import "./Stylesheets/App.css";
import TriviaTest from "./Components/TriviaTest";
import ChatTest from "./Components/ChatTest";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Components/Register";

function App() {
  return (
    <div className="App">
      <Router>
        <TriviaTest />
        <Routes>
          <Route exact path="/register" element={<Register />} />

          {/* <ChatTest /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
