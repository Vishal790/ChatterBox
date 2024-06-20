import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { uploadFilesToCloudinary } from '../utils/features.js';
import {v2 as cloudinary}from'cloudinary';

export const signup = async (req, res) => {
  const { name, userName, password, bio, email } = req.body;
  const file = req.file;
  //console.log("file............................... -> ", file);
 
  // Check for required fields
  if (!name || !userName || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ success:false, message: "Username already exists" });
    }

    // Upload file to Cloudinary
    const result = await uploadFilesToCloudinary([file]);
    console.log("Result.........  ",result);
    // Create a new user
    const avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };


    console.log("avatar",avatar);

    const newUser = new User({
      name,
      userName,
      password: hashedPassword,
      bio,
      email,
      avatar,
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const payload = {
      name: newUser.name,
      userName: newUser.userName,
      id: newUser._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    const cookieOptions = {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    }; 

    // Remove password from response
    newUser.password = undefined;

    // Set cookie and send response
    res.cookie("chatterbox", token, cookieOptions).status(200).json({
      success: true,
      token,
      newUser,
      message: "User created successfully",
    });
  } catch (error) {
   console.error("Error signing up:", error);
    res.status(500).json({ message: "Error signing up" }); 
  }
};



export const login = async (req, res) => {

  console.log(req.body);

  const { userName, password } = req.body;

  console.log(userName);

  try {
    const user = await User.findOne({ userName }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If user and password are correct, generate JWT token
    const payload = {
      name: user.name,
      userName: user.userName,
      id: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // Set the token in cookie
    const cookieOptions = {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    };
    res.cookie("chatterbox", token, cookieOptions)
    .json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        userName: user.userName,
        token: token,
        avatar: user.avatar,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};




export const logOut = (req, res) => {
  // Clear the cookie containing the authentication token
  res.clearCookie("chatterbox");

  // Send a response indicating successful logout
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
