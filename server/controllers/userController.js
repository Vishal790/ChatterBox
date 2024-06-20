import User from "../models/user.js";
import Request from "../models/request.js";
import Chat from "../models/chat.js";
import { emitEvent } from "../utils/features.js";
import mongoose from "mongoose";

export const getProfile = async (req, res) => {
  const id = req.user.id;

  const userDetails = await User.findById(id);
 // console.log(userDetails);

  res.status(200).json({
    success: true,
    message: "User details fetched successfully",
    data: userDetails, 
  });
};

export const searchUser = async (req, res) => {
  const { name } = req.query;
  const currentUserId = req.user.id;

  try {
    // Retrieve the current user's friends list
    const currentUser = await User.findById(currentUserId).populate("friends");
    const friendsIds = currentUser.friends.map((friend) => friend._id);

    // Find users who are not in the current user's friends list and match the optional name query
    const users = await User.find({
      _id: { $nin: [...friendsIds, currentUserId] },
      name: { $regex: name || "", $options: "i" }, // Case-insensitive search, default to empty string if name is not provided
    }).select("name avatar.url"); // Select only the fields you need to return

    const usersWithAvatarUrls = users.map((user) => ({
      ...user.toObject(),
      avatar: user.avatar.url, // Replace the avatar object with just the URL string
    }));

    // Return the search results
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: usersWithAvatarUrls,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching for users",
      error: error.message,
    });
  }
};

export const sendFriendRequest = async (req, res) => {
  const { userId } = req.body;

  console.log("sender", req.user.id);
  console.log("receiver", userId);

  try {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if a request already exists
    const existingRequest = await Request.findOne({
      $or: [
        { sender: req.user.id, receiver: userId },
        { receiver: req.user.id, sender: userId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Friend request already sent or received.",
      });  
    }
  console.log("BEFORE SENDING");
    // Create a new friend request
    const newRequest = await Request.create({
      sender: req.user.id,
      receiver: userId,
    });

    console.log("After SENDING");

    // Emit event to notify the receiver of the new friend request
      console.log("BEFORE emitting");

    emitEvent(req, "NEW_REQUEST", [newRequest.receiver], "request");

    console.log("After emitting");



    // Return success response with the new request data
    return res.status(201).json({
      success: true,
      message: "Friend request sent successfully.",
      data: newRequest,  
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending the friend request.",
      error: error.message,
    });
  }
};

export const handleFriendRequest = async (req, res) => {
  const { requestId, action } = req.body;

  try {
    if (typeof action !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid action specified. It must be a boolean.",
      });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    if (request.receiver.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to handle this request.",
      });
    }

    if (action) {
      request.status = "accepted";
      await request.save();

      // Add each other to friends list
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { friends: request.sender },
      });

      await User.findByIdAndUpdate(request.sender, {
        $addToSet: { friends: req.user.id },
      }); //addtoset so that np duplicate entries are inserted

      const chatName = `${request.sender}-${request.receiver}`; 
      const newChat = await Chat.create({
        name: chatName,
        groupChat: false,
        creator: req.user.id,
        members: [req.user.id, request.sender],
      });  

      emitEvent(req, "REFETCH_CHATS", [request.sender, request.receiver]);

       await request.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Friend request accepted.",
      });
    } else {
      await request.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Friend request rejected.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while handling the friend request.",
      error: error.message,
    });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    
    const requests = await Request.find({ receiver: req.user.id }).populate(
      "sender",
      "name avatar"
    ); 

    const allRequests = requests.map((request) => ({
      _id: request._id,
      name: request.sender.name,
      avatar: request.sender.avatar.url,
    }));

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully.",
      data: allRequests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching notifications.",
      error: error.message,
    });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friends","name avatar _id");

    const friends = user.friends.map((friend) => ({
      name :friend.name,
      avatar : friend.avatar.url,
      _id:friend._id,

  }));

    return res.status(200).json({
      success: true,
      message: "Friends fetched successfully.",
      data: friends,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching friends.",
      error: error.message,
    });
  }
};

//watch from 6:27  ad file == req,file in signup and attachments