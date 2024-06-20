import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black to-red-400">
      {/* Frosted glass effect */}
      <div className="absolute inset-0 bg-white bg-opacity-25 backdrop-blur-md"></div>

      <div className="relative z-10">
        <div className="max-w-md w-full p-8 bg-white bg-opacity-50 rounded-lg shadow-lg text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to Chatterbox
          </h1>
          <p className="text-gray-600 mb-8">
            Connect with friends and chat in real-time!
          </p>
          <div className="flex justify-center">
            <Link
              to="/login"
              className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded mr-4 transition duration-300"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
