import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { login } from '../../services/operations/auth';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({toggleLogin}) => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  function submitHandler(event) {
    event.preventDefault();
    dispatch(login(formData.userName,formData.password,navigate))
   
  }
  
  return (
    <div>
      <h1 className="text-center py-5 text-richblack-400 text-3xl font-bold">
        Log in
      </h1>

      <form onSubmit={submitHandler} className=" form-style flex flex-col ">
        <div className=" flex flex-col gap-[20px]">
          <label htmlFor="userName">
            <p className="text-[0.875rem] text-gray-600 mb-1 leading-[1.375rem]">
              User Name <sup className="text-pink-200">*</sup>
            </p>

            <input
              type="userName"
              name="userName"
              value={formData.userName}
              placeholder="Enter User Name"
              onChange={changeHandler}
              className="  bg-richblack-5   rounded-[0.5rem] text-black
             p-[12px]"
              required
            />
          </label>

          <label htmlFor="password">
            <p className="text-[0.875rem] text-gray-600 mb-1 leading-[1.375rem]">
              Password <sup className="text-pink-200">*</sup>
            </p>

            <input
              type='password'
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={changeHandler}
              className=" bg-richblack-5 rounded-[0.5rem]  text-black
            w-full p-[12px]"
              required
            />
          </label>

          <div className=" mx-auto flex gap-x-3">
            <button className="px-5 bg-red-400 sm:px-10 py-2 rounded-[30px] text-white border border-white">
              Log in
            </button>
            <button
              onClick={toggleLogin}
              className=" px-5 sm:hidden bg-white sm:px-10 py-2 rounded-[30px] text-red-400 border border-red-400"
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm