import express from "express";
import dotenv from "dotenv";

import Message from "./models/message.js";
const app = express();
dotenv.config();

import { connect } from "./config/databaseConfig.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuidv4 } from "uuid";
import { getSockets } from "./utils/features.js";
import cors from "cors";


const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:4000",
      "https://chatter-box-git-main-vishal790s-projects.vercel.app",
      "https://chatter-box-rust.vercel.app",
    ],
    credentials: true,
  },
});

// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request.res || {}, () => next());
// })
app.set("io", io);


server.get("/", (req, res) => {
  console.log("connected to server");
  return res.json({
    success: true,
    message: "Backend is working"
  })
});


import userRoutes from "./routes/User.js";
import chatRoutes from "./routes/Chat.js";

const PORT = process.env.PORT || 4000;

import {cloudinaryConnect} from "./config/cloudinaryConfig.js"
import { socketAuth } from "./middlewares/auth.js";

cloudinaryConnect();



app.use(
  cors({
    origin: [
      "http://localhost:4000",
      "https://chatter-box-git-main-vishal790s-projects.vercel.app",
      "https://chatter-box-rust.vercel.app",
    ],
    credentials: true,
  })
); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connect();

app.use("/api/v1", userRoutes);
app.use("/api/v1", chatRoutes);

export const userSocketIds = new Map();

// io.use((socket,next)=>{
//   // cookieParser()(socket.request,socket.request.res,async(error)=>{
//   //   socketAuth(error,socket,next)
//   // })
//  next();
// });



io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (err) => {
    try {
      if (err) {
        console.error("Cookie parsing error:", err);
        return next(err);
      }
      socketAuth(err, socket, next);
      //console.log("After middleware");
    } catch (error) {
      console.error("Error in middleware:", error);
      next(error); 
    }
  });
});



const onlineUsers = new Set();
io.on("connection", (socket) => {
  const user = socket.user;
 //console.log("USER: ",user);
  
   onlineUsers.add(user._id.toString());
   io.emit("ONLINE_USERS", Array.from(onlineUsers));

  userSocketIds.set(user._id.toString(), socket.id);

 // console.log("user connected", userSocketIds);

  socket.on("NEW_MESSAGE", async ({ chatId, members, message }) => { 
    //console.log("MESSAGE: ",message);
    const messageForRealTime = {
      content: message,
      _id: uuidv4(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };
    const messageForDb = {
      content: message,
      sender: user._id,
      chat: chatId,
      
    };

    const membersSocket = getSockets(members);

   // console.log("EMITTING", messageForRealTime);
    io.to(membersSocket).emit("NEW_MESSAGE", {
      chatId: chatId,
      message: messageForRealTime,
    });
    io.to(membersSocket).emit("NEW_MESSAGE_ALERT", {
      chatId,
    });

    await Message.create(messageForDb);

  });

  socket.on("START_TYPING",({members,chatId})=>{
    
    const membersSocket = getSockets(members);
    socket.to(membersSocket).emit("START_TYPING",{chatId})
  })
   socket.on("STOP_TYPING", ({ members, chatId }) => {
     const membersSocket = getSockets(members);
     socket.to(membersSocket).emit("STOP_TYPING", { chatId });
   });
 
  socket.on("disconnect", (reason) => {
    userSocketIds.delete(user._id.toString());
    //console.log("User disconnected. Reason:", reason); // Log reason
      onlineUsers.delete(user._id.toString());
      io.emit("ONLINE_USERS", Array.from(onlineUsers));
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
