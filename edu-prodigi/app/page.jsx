"use client";
import { useState } from "react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true); // State to track whether it's a login or signup

  const toggleForm = () => {
    setIsLogin(!isLogin); // Toggle between login and signup
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Edu Prodigi</h1>
          <p className="text-lg">
            Please {isLogin ? "login" : "sign up"} to continue.
          </p>
        </div>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
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
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
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
