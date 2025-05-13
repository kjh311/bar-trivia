import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [name, setName] = useState("");
  //   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          name,
          password,
        }
      );

      const { token, user, message } = response.data; // Correctly destructure message

      localStorage.setItem("token", token);
      localStorage.setItem("Bar-Trivia-Username", user.name);
      setSuccessMessage(message); // Use message directly
      setError("");
      console.log("Registration successful:", response.data);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError(err.response.data.message || "Username already exists!");
        setSuccessMessage("");
      } else {
        setError("An unexpected error occurred during registration");
        setSuccessMessage("");
        console.error("Registration error:", err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mx-4 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3">
        <h3 className="text-2xl font-bold text-center text-gray-800">
          Create Account
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-xs italic mt-4">
              {successMessage}
            </p>
          )}

          <div className="flex items-center justify-between mt-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Register
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="/login"
            >
              Already have an account? Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
