import { CameraAlt } from "@mui/icons-material";
import { Avatar, IconButton, Stack } from "@mui/material";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {toast} from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../services/operations/auth";

const SignupForm = ({isLogin,setIsLogin,toggleLogin}) => {

   const dispatch  = useDispatch();
   const navigate = useNavigate();

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm(); 
    const fileInputRef = useRef(null);

     const onSubmit = async (data) => {
       // Access the file input value from the event
       const file = fileInputRef.current.files[0];
       // Update the form data with the file value 
       const formDataWithImage = { ...data, avatar: file };
       console.log(formDataWithImage); // Form data with image included

       try {
       dispatch(signUp(formDataWithImage, navigate));
      // Clear the form fields
      reset();
      // Reset the file input
      fileInputRef.current.value = null;
      setPreviewSource(null);

    } catch (error) {
      console.error("Sign up failed:", error);
    }
 
    };




  const [previewSource, setPreviewSource] = useState(null);


  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input ref is null");
    }
  };


  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    previewFile(file);
  }
  // Update the form data directly
  
}


  return (
    <div>
      <h1 className="text-center py-5 text-richblack-400 text-3xl font-bold">
        Sign up
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" form-style flex flex-col "
      >
        <div className=" flex flex-col gap-[15px]">
          <Stack position="relative" width="10rem">
            <Avatar
              className="ml-8"
              sx={{
                width: "8rem",
                height: "8rem",
                objectFit: "contain",
              }}
              src={previewSource}
            />

            <label htmlFor="image">
              <span onClick={handleClick}>
                <IconButton
                  className="bg-red-600"
                  sx={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    transform: "translate(50%, 50%)",
                  }}
                >
                  <CameraAlt />
                  <input
                    type="file"
                    name="image"
                    id="image"
                    ref={fileInputRef} // Assign the ref here
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </IconButton>
              </span>
            </label>
          </Stack>

          <label htmlFor="name">
            <p className="text-[0.875rem] text-gray-600 mb-1 leading-[1.375rem]">
              Name <sup className="text-pink-200">*</sup>
            </p>

            <input
              type="name"
              name="name"
              placeholder="Enter Name"
              {...register("name", { required: true })}
              className="  bg-richblack-5   rounded-[0.5rem] text-black
             p-[12px]"
            />
            {errors.name && <p className="text-red-500">Name is required</p>}
          </label>

          <label htmlFor="bio">
            <p className="text-[0.875rem] text-gray-600 mb-1 leading-[1.375rem]">
              Bio <sup className="text-pink-200">*</sup>
            </p>

            <input
              type="text"
              name="bio"
              placeholder="Enter Bio"
              {...register("bio", { required: "Bio is required" })}
              className="bg-richblack-5 rounded-[0.5rem] text-black p-[12px]"
            />
            {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}
          </label>

          <label htmlFor="userName">
            <p className="text-[0.875rem] text-gray-600 mb-1 leading-[1.375rem]">
              User Name <sup className="text-pink-200">*</sup>
            </p>

            <input
              type="text"
              name="userName"
              placeholder="Enter User Name"
              {...register("userName", { required: "User Name is required" })}
              className="bg-richblack-5 rounded-[0.5rem] text-black p-[12px]"
            />
            {errors.userName && (
              <p className="text-red-500">{errors.userName.message}</p>
            )}
          </label>

          <label htmlFor="password">
            <p className="text-[0.875rem] text-gray-600 mb-1 leading-[1.375rem]">
              Password <sup className="text-pink-200">*</sup>
            </p>

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              {...register("password", { required: "Password is required" })}
              className="bg-richblack-5 rounded-[0.5rem] text-black p-[12px]"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </label>

          <div className=" mx-auto  flex gap-x-3">
            <button
              type="submit"
              className=" px-5 bg-red-400 sm:px-10 py-2 rounded-[30px] text-white border border-white"
            >
              Sign up
            </button>

            <button
              onClick={toggleLogin}
              className=" px-5 sm:hidden bg-white sm:px-10 py-2 rounded-[30px] text-red-400 border border-red-400"
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;

