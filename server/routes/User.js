import express from "express";
import { signup, login,logOut } from "../controllers/authController.js";
import { singleAvatar } from "../middlewares/fileUpload.js";
import { auth } from "../middlewares/auth.js";
import { searchUser, getProfile, sendFriendRequest, handleFriendRequest, getAllNotifications, getMyFriends } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup",singleAvatar , signup);
router.post("/login", login);



router.get("/profile", auth ,getProfile)
router.post("/logout",auth, logOut);
router.get("/search",auth,searchUser);
router.post("/send-request", auth, sendFriendRequest);
router.put("/handle-request",auth,handleFriendRequest);
router.get("/notifications",auth,getAllNotifications);
router.get("/friends",auth,getMyFriends);




export default router;
