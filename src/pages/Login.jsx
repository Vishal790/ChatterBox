import React, { useState } from "react";
import LoginForm from "../components/Home/LoginForm";
import SignupForm from "../components/Home/SignupForm";

const Login = () => {

    const [isLogin,setIsLogIn] = useState(false);

    const toggleLogin = ()=>{
        setIsLogIn(prev =>!prev);
        console.log(setIsLogIn);
    }


  return (
    <div className="flex items-center justify-center h-screen bg-richblack-5 ">
      <div
        className=" w-[350px] sm:w-[600px] rounded-lg flex shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] h-fit"
        // style={{
        //   height: isLogin ? "350px" : "690px",
        //   overflow: "hidden",
        //   transition: "height 0.5s ease-in-out",
        // }}
      >
        <div className=" rounded-tl-lg rounded-bl-lg bg-white w-[100%] sm:w-[65%] flex flex-col items-center justify-center p-3">
          {isLogin ? (
            <LoginForm
              isLogin={isLogin}
              setIsLogIn={setIsLogIn}
              toggleLogin={toggleLogin}
            />
          ) : (
            <SignupForm
              isLogin={isLogin}
              setIsLogIn={setIsLogIn}
              toggleLogin={toggleLogin}
            />
          )}
        </div>
        <div className=" hidden w  sm:w-[45%]  rounded-tr-lg rounded-br-lg sm:flex flex-col gap-[70px] items-center justify-center p-3 bg-red-400">
          {isLogin ? (
            <>
              <div className=" flex flex-col gap-7 items-center justify-center mx-auto">
                <h1 className="text-white text-3xl font-bold text-center">
                  Welcome Back!
                </h1>
                <p className="text-white text-center">
                  Ready to jump back into the conversation? Enter your
                  credentials to log in.
                </p>
              </div>
              <button
                onClick={toggleLogin}
                className=" bg-red-400 px-10 py-2 rounded-[30px] text-white border border-white"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-7 items-center justify-center mx-auto">
                <h1 className="text-white text-3xl font-bold text-center">
                  Welcome New Friend!
                </h1>
                <p className="text-white text-center">
                  Join the conversation! Enter your details to sign up and start
                  chatting.
                </p>
              </div>
              <button
                onClick={toggleLogin}
                className=" bg-red-400 px-10 py-2 rounded-[30px] text-white border border-white"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
