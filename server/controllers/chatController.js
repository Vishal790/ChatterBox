import Chat from "../models/chat.js";
import User from "../models/user.js";
import Message from "../models/message.js";
import {
  deleteFilesFromCloudinary,
  emitEvent,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import mongoose from "mongoose";
import { Types } from "mongoose";
const { ObjectId } = Types;
import { v4 as uuidv4 } from "uuid";
import message from "../models/message.js";

export const newGroupChat = async (req, res) => {
  const { name, members } = req.body;

  //console.log("MEMBERS",members);

  if (members.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Group Chat must have more than 2 members",
    });
  }

  //console.log(req.user);

  const allMembers = [...members, req.user.id];

  console.log("ALLmembers", allMembers);

  try {
    // Create new chat
    const chat = await Chat.create({
      name,
      groupChat: true,
      creator: req.user.id,
      members: allMembers,
    });

    const allMembersWithIds = allMembers.map((id) => ({ _id: id }));

    // Emit events
    emitEvent(req, "ALERT", chat.members, {
      message: `Welcome to ${name} group`,
      chatId: chat._id,
    });
    emitEvent(req, "REFETCH_CHATS", chat.members);

    return res.status(200).json({
      success: true,
      message: "Group Chat Created Successfully",
    });
  } catch (error) {
    console.error("Error creating group chat:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//util function
// const formatChatData = (chats, currentUserId) => {
//   return chats.map((chat) => {
//     // If it's a group chat, construct an avatar with 3 members' avatars
//     if (chat.groupChat) {
//       const avatars = chat.members
//         .map((member) => member.avatar.url)
//         .slice(0, 3);
//       const members = chat.members.reduce((acc, member) => {
//         if (member._id.toString() !== currentUserId) {
//           acc.push(member._id);
//         }
//         return acc;
//       }, []);
//       return { ...chat.toObject(), avatar: avatars, members };
//     } else {
//       // If it's a one-to-one chat, find the other user's avatar
//       const otherUser = chat.members.filter(
//         (member) => member._id.toString() !== currentUserId
//       );
//       const otherUserAvatars = otherUser.map((user) => user.avatar.url);
//       const members = otherUser.map((member) => member._id);
//       return { ...chat.toObject(), avatar: otherUserAvatars, members };
//     }
//   });
// };

// export const getMyChats = async (req, res) => {
//   try {
//     const chats = await Chat.find({ members: req.user.id })
//       .populate("creator", "name avatar")
//       .populate("members", "name avatar");

//     // console.log(chats);

//     const formattedChats = formatChatData(chats, req.user.id);

//     return res.status(200).json({
//       success: true,
//       data: formattedChats,
//       message: "Chats fetched successfully",
//     });
//   } catch (error) {
//     console.error("Error fetching chats:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch chats",
//     });
//   }
// };

const formatChatData = (chats, currentUserId) => {
  return chats.map((chat) => {
    if (chat.groupChat) {
      // Handle group chats
      const avatars = chat.members
        .map((member) => member.avatar.url)
        .slice(0, 3);
      const members = chat.members.reduce((acc, member) => {
        if (member._id.toString() !== currentUserId) {
          acc.push(member._id);
        }
        return acc;
      }, []);
      return { ...chat.toObject(), avatar: avatars, members };
    } else {
      // Handle one-to-one chats
      const otherUser = chat.members.find(
        (member) => member._id.toString() !== currentUserId
      );
      const otherUserAvatar = otherUser.avatar.url;
      const otherUserName = otherUser.name;
      return {
        ...chat.toObject(),
        avatar: [otherUserAvatar],
        name: otherUserName,
        members: [otherUser._id],
      };
    }
  });
};

// Controller to get user's chats
export const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.user.id })
      .populate("creator", "name avatar")
      .populate("members", "name avatar");

    const formattedChats = formatChatData(chats, req.user.id);

    return res.status(200).json({
      success: true,
      data: formattedChats,
      message: "Chats fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const groups = await Chat.find({
      members: req.user.id,
      groupChat: true,
      creator: req.user.id,
    }).populate("members", "name avatar");

    const formattedGroups = groups.map((group) => ({
      _id: group.id,
      name: group.name,
      groupChat: group.groupChat,
      avatar: group.members.slice(0, 3).map((member) => member.avatar.url),
      members: group.members
        .filter((member) => member._id.toString() !== req.user.id)
        .map((member) => member._id),
    }));

    return res.status(200).json({
      success: true,
      data: formattedGroups,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch groups",
    });
  }
};

export const addMembers = async (req, res) => {
  const { chatId, members } = req.body;
  console.log("members",members);
  try {
    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    // Check if chat exists
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if it's a group chat
    if (!chat.groupChat) {
      return res
        .status(400)
        .json({ message: "Cannot add members to an individual chat" });
    }

    if (!members || members.length < 1) {
      return res.status(400).json({ message: "Members cannot be empty" });
    }

    //check admin permissions
    if (chat.creator.toString() != req.user.id.toString()) {
      return res
        .status(400)
        .json({ message: "You are not the admin of this group" });
    }

    // Add members to the chat
    // Ensure only unique member IDs are added
    const uniqueMemberIds = members.filter(
      (memberId) => !chat.members.includes(memberId)
    );
    

    // Add member IDs to the chat's members array
    chat.members.push(...uniqueMemberIds);
    // Save the updated chat
    await chat.save();

    // Fetch user objects corresponding to the member IDs
    const users = await User.find({ _id: { $in: members } });

    // Extract names of all added users
    const allUsersName = users.map((user) => user.name);
    emitEvent(req, "ALERT", chat.members, {
      message: `${allUsersName} has been added in the group`,
      chatId,
    });

    //  emitEvent(req, "REFETCH_CHATS", chat.members);
    emitEvent(
      req,
      "REFETCH_CHATS",
      uniqueMemberIds.map((uniqueMemberId) => mongoose.Types.ObjectId.createFromHexString(uniqueMemberId))
    );

    //when removing refetch only to the removed member (think) and when adding refetch only to the add member (think)

    return res.status(200).json({
      success: true,
      message: "Members added successfully",
      data: chat,
    });
  } catch (error) { 
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const removeMember = async (req, res) => {
  const { userId, chatId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate chat ID
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if(chat.creator.toString()===userId.toString())
      {
        return res.json({
          success: false,
          message: "Admin Cannot be Removed",
        });
      }

    // Find the chat by ID and update it to remove the user's ID from the member list
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { members: userId } },
      { new: true } // Return the modified document after update
    );

    // Check if the chat was found and updated
    if (!updatedChat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    emitEvent(req, "ALERT", updatedChat.members, {
      message: `${user.name} has been removed from the group`,
      chatId,
    });
    emitEvent(req, "REFETCH_CHATS", [user._id]);

    return res.status(200).json({
      success: true,
      message: "User removed from the chat",
      data: updatedChat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

export const leaveGroup = async (req, res) => {
  const chatId = req.params.id;
  const userId = req.user.id;

  try {
    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    // Check if the chat exists
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Check if the user is a member of the chat
    if (!chat.members.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "User is not a member of this chat",
      });
    }

    // Check if the user leaving is the creator of the chat
    if (chat.creator.toString() === userId.toString()) {
      const remainingUsers = chat.members.filter(
        (member) => member.toString() !== userId.toString()
      );

      // If there are remaining members, assign a new creator
      if (remainingUsers.length > 0) {
        const newCreator = remainingUsers[0];
        chat.creator = newCreator;
      } else {
        // If no remaining members, delete the chat
        await Chat.findByIdAndDelete(chatId);
        return res.status(200).json({
          success: true,
          message: "Chat deleted as the last member left",
        });
      }
    }

    // Remove the user from the members array
    chat.members = chat.members.filter(
      (member) => member.toString() !== userId.toString()
    );

    // Save the updated chat
    await chat.save();

    emitEvent(
      req,
      "ALERT",
      chat.members,
      {message:`${req.user.name} has left from the group`,chatId}
    );
   emitEvent(req, "REFETCH_CHATS", [
     mongoose.Types.ObjectId.createFromHexString(req.user.id),
   ]);

    return res.status(200).json({
      success: true,
      message: "User left the chat successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

export const sendAttachments = async (req, res) => {
  const { chatId } = req.body;
  const files = req.files || [];

  //  console.log("CHAT_ID", chatId);
  //  console.log("FILES", files);
  try {
    // Validate chatId
    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No attachments provided",
      });
    }

    console.log("before uploading ");

    const attachments = await uploadFilesToCloudinary(files);
    console.log("after uploading attachments");

    const messageForRealTime = {
      content: "",
      attachments,
      sender: {
        _id: req.user.id,
        name: req.user.name,
      },
      chat: chatId,
      _id: uuidv4(),
    };

    const messageForDb = {
      content: "",
      attachments,
      sender: req.user.id,
      chat: chatId,
    };

    const message = await Message.create(messageForDb);

    emitEvent(req, "NEW_MESSAGE", chat.members, {
      message: messageForRealTime,
      chatId: chatId,
    });

    emitEvent(req, "NEW_MESSAGE_ALERT", chat.members, {
      chatId,
    });

    return res.status(201).json({
      success: true,
      message: "Attachments sent successfully",
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending attachments",
      error: error.message,
    });
  }
};

export const getChatDetails = async (req, res) => {
  const chatId = req.params.id;

  try {
    const chat = await Chat.findById(chatId).populate(
      "members",
      "name userName avatar"
    );
    //console.log("CHAT", chat);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat details retrieved successfully",
      data: chat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching chat details",
      error: error.message,
    });
  }
};

export const renameGroup = async (req, res) => {
  const chatId = req.params.id;
  const { name } = req.body;

  console.log("chatid", chatId);
  console.log("name", name);

  // console.log(chatId);

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    //console.log("Chat:", chat);
    //console.log(req.user.id);

    if (!chat.groupChat) {
      return res.status(400).json({
        success: false,
        message: "Chat is not a group chat",
      });
    }

    if (!chat.creator || chat.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to rename this group",
      });
    }

    chat.name = name;
    await chat.save();

    emitEvent(req, "REFETCH_CHATS", chat.members);

    return res.status(200).json({
      success: true,
      message: "Group renamed successfully",
      data: chat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while renaming the group",
      error: error.message,
    });
  }
};

export const deleteChat = async (req, res) => {
  const chatId = req.params.id;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (chat.groupChat && chat.creator.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this group chat",
      });
    }

    console.log("CHAT TO BE DELETED", chat);

    const members = chat.members;
    // console.log("MENBERS,", members);

    // Find all messages with attachments in the chat
    const messageAttachments = await Message.find({
      chat: chatId,
      attachments: { $exists: true, $ne: [] },
    });

    const publicIds = [];

    messageAttachments.forEach((message) => {
      message.attachments.forEach(({ public_id }) => publicIds.push(public_id));
    });

    // Delete files from Cloudinary
    if (publicIds.length > 0) {
      await deleteFilesFromCloudinary(publicIds);
    }


    if (!chat.groupChat) {
      const member1Id = members[0];
      const member2Id = members[1];

      console.log("MEMbers, fetched");

      try {
        // Find both users
        const user1 = await User.findById(member1Id);
        const user2 = await User.findById(member2Id);

        console.log("user1", user1)
        console.log("user2",user2);;

        if (!user1 || !user2) {
          return res.status(404).json({
            success: false,
            message: "One or both users not found",
          });
        }


        console.log("before pulling");

        // Remove each member from the other's friends array
        user1.friends.pull(member2Id);
        user2.friends.pull(member1Id);

        console.log("after pulling user1", user1);
        console.log("after pulling user 2", user2);

        console.log("after pulling");

        // Save the updated users
        await user1.save();
        await user2.save();

        console.log("after saving");


      } catch (error) {
        return res.json({
          success: false,
          message: "An error occurred while finding or updating users",
          error: error.message,
        });
      }
    }
    // Delete chat and associated messages
    await chat.deleteOne();
    await Message.deleteMany({ chat: chatId });

    // Emit event to notify members
    emitEvent(req, "REFETCH_CHATS", members);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the chat",
      error: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  const chatId = req.params.id;
  const { page = 1 } = req.query;
  const resultPerPage = 20;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching chat",
      error: error.message,
    });
  }

  if (!chat.members.includes(req.user.id.toString())) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to access the chat",
      error: error.message, 
    });
  }
  try {
    // Find the messages with the specified chatId, sorted by creation time in descending order
    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * resultPerPage)
      .limit(resultPerPage)
      .populate("sender", "name avatar")
      .lean(); // Convert Mongoose documents to plain JavaScript objects to avoid circular references

    // Get the total count of messages for the specified chatId
    const totalMessagesCount = await Message.countDocuments({ chat: chatId });
    const totalPages = Math.ceil(totalMessagesCount / resultPerPage);

    // if (page > totalPages) {
    //   return res.status(200).json({
    //     success: false,
    //     message: "You have reached till the top of the page",
    //   });
    // }

    // Return the response with the messages and pagination info
    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: messages,
      page: parseInt(page),
      limit: resultPerPage,
      totalPages,
      totalMessagesCount,
    });
  } catch (error) {
    // Handle any errors that occur during message fetching
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching messages",
      error: error.message,
    });
  }
};
