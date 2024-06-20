import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = (req, res, next) => {
  const token =
    req.cookies["chatterbox"] ||
    req.body.token ||
    req.header("Authorization").replace("Bearer ", "");

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is not present",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;
    // console.log(req.user);

    next();
  } catch (error) {
    // Return error if token verification fails
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};


// const socketAuth = async(err,socket,next) => {
// try {

//   if(err){
//     return next(err);

//     const authToken = socket.request.cookies["chatterbox"];
//     const decoded = jwt.verify(authToken,process.env.JWT_SECRET);
//     socket.user = await User.findById(decoded._id);

//     return next();
//   }
  
// } catch (error) {

//   console.log(error);
//   return next(e)
  
// }

// };

const socketAuth = async (err,socket, next) => {
  try {
    const authToken =
      socket.request.cookies["chatterbox"] || socket.handshake.auth.token;

   //   console.log("AUTH TOKEN", authToken);

    if (!authToken) {
      return next(new Error("Token not Found"));
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
  //  console.log("decoded", decoded);
    const user = await User.findById(decoded.id);
    if(!user)
      {
        return next(new Error("User Not Found"));
      }
//      console.log("object,user", user);

      socket.user = user;
    return next();
  } catch (error) {
    console.error(error);
    //return next(new Error("Socket Authentication error"));
  }
};




export { auth,socketAuth };
