import { AttachFile } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useDebugValue,
} from "react";
import FileMenu from "../components/Chat/FileMenu";
import { sampleMessage } from "../components/SampleData/sampleData";
import MessageComponent from "../components/Chat/MessageComponent";
import { Socket } from "socket.io-client";
import { getSocket } from "../utils/socket";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getChatDetails, getMessages } from "../services/operations/chat";
import Spinner from "../components/utils/Spinner";
import toast from "react-hot-toast";
import { useInfiniteScrollTop } from "6pp";
import { setIsFileMenu } from "../redux/slices/miscSlice";
import { resetMessagesAlert } from "../redux/slices/chatSlice";

const Chat = () => {
  const [message, setMessage] = useState("");
  //const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [chat, setChat] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const chatId = useParams().chatId;
  const { token, user: currentUser } = useSelector((state) => state.auth);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const chatWindowRef = useRef(null);
  const [totalPages, setTotalPages] = useState(0);
  const [prevMessages, setPreviousMessages] = useState([]);
  const socket = getSocket();
  const [userTyping, setUserTyping] = useState(false);
  const [chatName, setChatName] = useState("");
  //console.log(userTyping);

  //const {user} = useSelector((state) => state.auth);

  //console.log("CURRENT_USER",currentUser);

  useEffect(() => {
    //console.log("USEEFFECT",chatId);
    fetchChatDetails(token, chatId);
    getAllMessages();
    // console.log("Dispatching resetMessagesAlert for chatId:", chatId);
    dispatch(resetMessagesAlert({ chatId }));
    return () => {
      setPageNo(1);
      setMessages([]);
      setMessage("");
      setOldMessages([]);
    };
  }, [chatId]);

  useEffect(() => {
    // Fetch messages when pageNo changes
    getAllMessages();
  }, [pageNo]);

  // Fetch chat details when the component mounts or chatId changes
  useEffect(() => {
    fetchChatDetails(token, chatId);
  }, [token, chatId]);

  const fetchChatDetails = async (token, chatId) => {
    try {
      const response = await getChatDetails(chatId, token);
      if (!response) {
        console.log("Error fetching chat details");
        return;
      }
      // console.log("CHATRESPONSE",response);
      setChat(response);

      if (!response.data.groupchat && response.data.members.length === 2) {
        const othermember = response.data.members.find(
          (member) => member._id != currentUser._id
        );
        // console.log("othermember",othermember);
        setChatName(othermember.name);
      } else setChatName(response.data.name);

      setMembers(response.data.members);
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  const getAllMessages = async () => {
    try {
      const response = await getMessages(token, chatId, pageNo);
      //  console.log(response.data);
      setPreviousMessages(response.data.reverse());
      setTotalPages(response.totalPages);
      setLoadingMessages(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoadingMessages(false);
    }
  };

  const newMessage = useCallback(
    (data) => {
      console.log("message",data);

      // console.log("Socket message",data);
      // console.log("BEfore sending attachments",messages);

      // console.log("DATAchatid", data.chatId);
      // console.log("CHATID", chatId);
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
      // console.log("After sending attachments", messages);
    },
    [chatId]
  );

  const startTypingListner = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );
  const stopTypingListener = useCallback(() => {
    setUserTyping(false);
  }, []);


  const alertHandler = useCallback(
    (data) => {
  //  console.log("listning alert");
  //     console.log("ALERT", data);  

      const messageForAlert = {
        content:data.message,
        sender: {
          _id: "asdfdffg",
          name: "Admin",
        },
         chat: data.chatId,
        createdAt: new Date().toISOString(),
      };

      console.log("REALTIME: ", messageForAlert);
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, messageForAlert]);
      // console.log("ALERT_MESSAGE", messages);
    },
    [chatId]
  );


  useEffect(() => {
    socket.on("ALERT", alertHandler);
    socket.on("NEW_MESSAGE", newMessage);
    socket.on("START_TYPING", startTypingListner);
    socket.on("STOP_TYPING", stopTypingListener);
  

    return () => {
      socket.off("ALERT", alertHandler);
      socket.off("NEW_MESSAGE", newMessage);
      socket.off("START_TYPING", startTypingListner);
      socket.off("STOP_TYPING", stopTypingListener);
    
    };
  }, [newMessage, startTypingListner, stopTypingListener, alertHandler]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (!message) {
      message.trim();
      return;
    }
    socket.emit("NEW_MESSAGE", { chatId, members, message });
    setMessage("");
  };

  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const handleFileOpen = () => {
    dispatch(setIsFileMenu(true));
  };

  const { user } = useSelector((state) => state.auth);

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    chatWindowRef,
    totalPages,
    pageNo,
    setPageNo,
    prevMessages
  );

  const allMessages = [...oldMessages, ...messages];
   console.log("All messages", allMessages);

  const { isUploading } = useSelector((state) => state.misc);

  // useEffect(() => {
  //   const scrollToBottom = () => {
  //     chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  //   };
  //   setTimeout(scrollToBottom, 100);
  // }, [messages,userTyping]);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, userTyping]);

  let typingTimeout = useRef(null);

  const debounce = (func, delay) => {
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(func, delay);
  };
  const changeHandler = (e) => {
    setMessage(e.target.value);

    socket.emit("START_TYPING", { members, chatId });
    debounce(() => {
      socket.emit("STOP_TYPING", { chatId });
    }, 1000);
  };

  return (
    <div className=" bg-white-component overflow-y-hidden rounded-tr-xl rounded-br-xl rounded-xl w-full h-full flex flex-col">
      <div className="h-[7%]  text-xl font-inter rounded-tr-xl rounded-tl-xl bg-icon-color text-richblack-5 flex items-center justify-center ">
        {chatName}
      </div>

      <div
        ref={chatWindowRef}
        className=" flex flex-col overflow-y-auto h-[83%]  px-2 py-2 overflow-x-hidden"
      >
        {loadingMessages && isUploading ? (
          <Spinner />
        ) : (
          allMessages.map((i) => (
            <MessageComponent key={i._id} message={i} user={user} />
          ))
        )}
        {userTyping && (
          <div className=" mt-2 bg-background-dark text-white w-fit px-5 py-2 rounded-xl">
            Typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="h-[10%] w-[80%] rounded-xl flex items-center justify-between mx-auto bg-white-component"
        onSubmit={handleMessageSubmit}
      >
        <button
          type="button"
          className="text-icon-color p-2 mr-2 hover:bg-input-color hover:rounded-full hover:bg-opacity-50 left-[5%] transform translate-x-[40%]"
          onClick={handleFileOpen}
        >
          <AttachFile />
        </button>

        <input
          type="text"
          value={message}
          onChange={changeHandler}
          className="bg-input-color  w-9/12 h-[70%]  px-5 rounded-xl focus:outline-none focus:ring focus:border-richblack-900"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="text-icon-color p-2 hover:bg-input-color hover:rounded-full hover:bg-opacity-50"
        >
          <SendIcon />
        </button>
      </form>

      {isFileMenu && <FileMenu />}
    </div>
  );
};

export default Chat;
