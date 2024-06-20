import { TextField } from "@mui/material";
import React, { useEffect } from "react";
import adminLogin from "../assets/Images/adminLogin.jpg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { register, formState, errors, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };
  const isAdmin = true;

  const navigate = useNavigate();
useEffect(()=>{
  
  if (isAdmin) {
    navigate("/admin/dashboard");
  }
});

  return (
    <div className="w-full h-screen flex items-center justify-center bgcontainer ">
      <div className="w-[400px] h-[350px] backdrop-filter backdrop-blur-lg bg-white bg-opacity-10 border border-white p-2 flex flex-col gap-y-10 rounded-lg">
        <h1 className="text-center mt-9 text-2xl font-inter">Admin Login</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-7"
        >
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            required
            fullWidth
            {...register("password", { required: true })}
            sx={{
              width: "80%",
              margin: "0 auto",
            }}
          />
          {errors && errors.password && <span>This field is required</span>}

          <button
            type="submit"
            className="mb-10 bg-red-400 px-5 py-2 w-fit mx-auto rounded-lg text-white hover:bg-red-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
