import { userSocketIds } from "../index.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose, { get } from "mongoose";
import { v4 as uuid } from "uuid";

export const emitEvent = (req, event, users, data) => {
  console.log("USERS", users);

  // users = users.map(user=> mongoose.Types.ObjectId.createFromHexString(user));

  // users=users.map(user=>mongoose.Types.ObjectId(user))
   
  const io =req.app.get('io');

  //console.log("users",users);

  const usersSocket = getSockets(users);
  console.log("usersSocket", usersSocket);

  io.to(usersSocket).emit(event,data);
  
  console.log(
    "emitting event",
    event,
    "to sockets",
    usersSocket,
    "with data",
    data
  );
};

const getBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

export const uploadFilesToCloudinary = async (files) => {
  try {
    const uploadedFiles = [];
    for (const file of files) {
      const base64Data = getBase64(file);
      const result = await cloudinary.uploader.upload(base64Data, {
        folder: "Chatterbox",
        resource_type: "auto",
        public_id: uuid(),
      });

      const formattedResult = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      uploadedFiles.push(formattedResult);
    }

    return uploadedFiles;
  } catch (error) {
    console.error("Error uploading file(s) to Cloudinary:", error);
    throw error;
  }
};

export const deleteFilesFromCloudinary = async (public_ids) => {};

export const getSockets = (users = []) => {
  return users.map((user) => userSocketIds.get(user._id.toString()));
};  
 