import React, { useState, useEffect } from "react";
import axios from "axios";
import { decode } from "he";

const TriviaTest = () => {
  const [triviaData, setTriviaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryDelayMs = 3000;

  const fetchTrivia = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `https://opentdb.com/api.php?amount=10${category}${difficulty}`
      );
      setTriviaData(res.data);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error("Failed to fetch trivia questions", err);
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
    if (triviaData?.results) {
      const allOptions = triviaData.results.map((item) => {
        const incorrectAnswers = item.incorrect_answers.map(decode);
        const correctAnswer = decode(item.correct_answer);
        const all = [...incorrectAnswers, correctAnswer];
        // Simple Fisher-Yates shuffle to randomize the order
        for (let i = all.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [all[i], all[j]] = [all[j], all[i]];
        }
        return all;
      });
      setOptions(allOptions);
    }
  }, [triviaData]);

  if (error) {
    return <div>Error loading trivia: {error.message}</div>;
  }

  return (
    <div>
      <form onSubmit={fetchTrivia} className="bg-red-100 p-2 m-2 text-center">
        <select onChange={(e) => setCategory(e.target.value)}>
          <option defaultValue disabled>
            Select Category
          </option>
          <option value="&category=9">General Knowledge</option>
          <option value="&category=10">Books</option>
          <option value="&category=11">Film</option>
          <option value="&category=12">Music</option>
          <option value="&category=13">Musicals and Theater</option>

          <option value="&category=14">TV</option>
          <option value="&category=15">Video Games</option>
          <option value="&category=16">Board Games</option>
          <option value="&category=17">Science and Nature</option>

          <option value="&category=18">Computers</option>
          <option value="&category=19">Mathematics</option>
          <option value="&category=20">Mythology</option>
          <option value="&category=21">Sports</option>

          <option value="&category=22">Geography</option>
          <option value="&category=23">History</option>
          <option value="&category=24">Politics</option>
          <option value="&category=25">Art</option>

          <option value="&category=26">Celebrities</option>
          <option value="&category=27">Animals</option>
          <option value="&category=28">Vehicles</option>

          <option value="&category=29">Comics</option>
          <option value="&category=30">Gadgets</option>
          <option value="&category=31">Manga</option>
          <option value="&category=32">Cartoons</option>
        </select>
        <br />
        <br />

        <select onChange={(e) => setDifficulty(e.target.value)}>
          <option disabled defaultValue>
            Difficulty
          </option>
          <option value="&difficulty=easy">East</option>
          <option value="&difficulty=medium">Medium</option>
          <option value="&difficulty=hard">Hard</option>
        </select>

        <br />
        <br />
        <button type="submit" className="bg-blue-500 p-2 m-2">
          Submit
        </button>
      </form>
      <br />
      <br />

      {loading && <p>Loading data...</p>}

      <br />
      <br />
      {triviaData?.results?.map((item, index) => (
        <div key={index}>
          <p>Question: {decode(item.question)}</p>
          <div>
            {options[index]?.map((option, optionIndex) => (
              <span key={optionIndex}>
                <button
                  className="p-2 m-2 bg-blue-200 border"
                  onClick={(e) => {
                    if (e.target.textContent === item.correct_answer) {
                      alert("Corrent!!!");
                    } else {
                      alert("Incorrect");
                    }
                  }}
                >
                  <span>{option}</span>
                </button>
                <br />
              </span>
            ))}
          </div>
          <br />
          {/* correct anwser: {item.correct_answer} <br /> */}
          <br />
        </div>
      ))}
    </div>
  );
};

export default TriviaTest;
