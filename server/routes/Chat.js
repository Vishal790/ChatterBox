import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
} from "../controllers/chatController.js";
import { attachmentsMulter } from "../middlewares/fileUpload.js";

const router = express.Router();

router.post("/groups", auth, newGroupChat);
router.get("/chats", auth, getMyChats);
router.get("/groups", auth, getMyGroups);
router.put("/addmembers", auth, addMembers);
router.put("/removemember", auth, removeMember);
router.delete("/leaveGroup/:id", auth, leaveGroup);
router.post("/message", auth, attachmentsMulter, sendAttachments);
router.get("/message/:id", auth, getMessages);

router
  .route("/chat/:id")
  .get(auth, getChatDetails)
  .put(auth, renameGroup)
  .delete(auth, deleteChat);

export default router;
