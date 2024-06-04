"use client";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true); // State to track whether it's a login or signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin); // Toggle between login and signup
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if the email is from a university domain
    const emailDomain = email.split("@")[1];
    if (!emailDomain.endsWith(".edu") && emailDomain !== "mail.utoronto.ca") {
      toast.error("Please sign up with a university email address.");
      return;
    }
    // Continue with your authentication logic here
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <ToastContainer />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Welcome to YourApp</h1>
          <p className="text-lg">
            Please {isLogin ? "login" : "sign up"} to continue.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={handleEmailChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-800 text-white"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-800 text-white"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            {isLogin ? "Log in" : "Sign up"}
          </button>
        </form>
        <div className="text-center">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleForm}
              className="ml-1 font-medium text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
