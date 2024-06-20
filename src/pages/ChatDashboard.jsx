import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../components/Auth/Navbar";
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ChatList from "../components/Chat/ChatList";
import { sampleChats } from "../components/SampleData/sampleData";
import Profile from "../components/Profile/Profile";
import { useDispatch, useSelector } from "react-redux";
import { getChats } from "../services/operations/chat";
import { Drawer, Skeleton } from "@mui/material";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../redux/slices/miscSlice";
import { getSocket } from "../utils/socket";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../redux/slices/chatSlice";
import DeleteChatMenu from "../components/Chat/DeleteChatMenu";
import { Search } from "@mui/icons-material";

const Dashboard = () => {
  const params = useParams();
  const chatId = params.chatId;
  const [onlineUsers,setOnlineUsers] = useState([])

  const { newMessagesAlert } = useSelector((state) => state.chat);

  const { token } = useSelector((state) => state.auth);
  const { isMobile } = useSelector((state) => state.misc);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const dispatch = useDispatch();
  // const location = useLocation();
  const navigate = useNavigate();
  const { isDeleteMenu } = useSelector((state) => state.misc);
  const deleteAnchor = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);

  const fetchMyChats = async (token) => {
    setIsLoading(true);
    try {
      const response = await getChats(token);
      //console.log("chats->",response);
      if (response && response.data) {
        setChats(response.data);
        setFilteredChats(response.data);
      } else {
        console.error("No data found in response:", response);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyChats(token);
  }, []);

  // useEffect(() => {
  //   fetchMyChats(token);
  // }, [location]);

  const handleDeleteChat = (e, chatId, groupChat) => {
    e.preventDefault();
    deleteAnchor.current = e.currentTarget;
    dispatch(setSelectedDeleteChat({ chatId, groupChat }));
    console.log("chat deleted", chatId, groupChat);
    dispatch(setIsDeleteMenu(true));
  };

  const handleMobileClose = () => {
    dispatch(setIsMobile(false));
  };

  const socket = getSocket();

  const newMessageAlertHandler = useCallback(
    (data) => {
      //  console.log("ALErt",data.chatId);
      if (data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data));
    },
    [chatId]
  );

  const refetchListner = useCallback(() => {
    fetchMyChats(token);
    navigate("/home");
  }, [navigate]);

  const newRequestAlertHandler = useCallback(() => {
    console.log("New request received. Dispatching incrementNotification...");
    dispatch(incrementNotification());
  }, [dispatch]);

  const onlineUsersAlertHandler = useCallback((data)=>{
  //  console.log(data);
   setOnlineUsers(data);
  },[onlineUsers])

  useEffect(() => {
    socket.on("NEW_MESSAGE", newMessageAlertHandler);
    socket.on("NEW_REQUEST", newRequestAlertHandler);
    socket.on("REFETCH_CHATS", refetchListner);
    socket.on("ONLINE_USERS",onlineUsersAlertHandler);

    return () => {
      socket.off("NEW_MESSAGE", newMessageAlertHandler);
      socket.off("FRIEND_REQUEST_ACCEPTED", refetchListner);
    };
  }, [newRequestAlertHandler, newMessageAlertHandler]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
    useEffect(() => {
      const results = chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChats(results);
    }, [searchTerm, chats]);

  return (
    <>
      <Navbar />
      <DeleteChatMenu dispatch={dispatch} deleteAnchor={deleteAnchor} />
      <div className="flex-grow h-calc(100vh - 3.5rem) grid grid-cols-12 px-2 pb-2  gap-x-2">
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer
            open={isMobile}
            onClose={handleMobileClose}
            PaperProps={{
              style: {
                height: "100%",
                top: "3.5rem",
                width: "80%",
                maxHeight: "calc(100vh - 3.5rem)",
                paddingTop: "1rem",
                paddingLeft: "0.5rem",
                paddingRight: "0.5rem",
                overflow: "auto",
                backgroundColor: "#f0efef",
                overflowY: "auto",
              },
            }}
            className="sm:hidden"
          >
            <div className=" relative flex items-center w-full mb-3 mt-2">
              <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Search"
                className="w-full border border-gray-300 rounded-full px-3 py-2 mb-3 bg-input-color mt-2"
              />
              <div className="absolute right-3  top-1/2 transform -translate-y-1/2">
                <Search color="grey" />
              </div>
            </div>
            <ChatList
              chats={filteredChats}
              chatId={chatId}
              onlineUsers={onlineUsers}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
            />
          </Drawer>
        )}

        {/* Left section: Chat List and Group List */}
        <div className="hidden sm:block sm:col-span-4 md:col-span-3  rounded-tl-xl rounded-bl-xl rounded-xl  bg-white-component h-full  ">
          <div className=" bg-richblack-0 pt-2 pl-1 pr-1 overflow-y-auto max-h-full ">
            <div className=" relative flex items-center w-full mb-3 mt-2">
              <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Search"
                className="w-full border border-gray-300 rounded-full px-3 py-2 mb-3 bg-input-color mt-2"
              />
              <div className="absolute right-3  top-1/2 transform -translate-y-1/2">
                <Search color="grey" />
              </div>
            </div>

            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={filteredChats}
                chatId={chatId}
                onlineUsers={onlineUsers}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
              />
            )}
          </div>
        </div>

        {/* Middle section: Dynamic content */}
        <div className="col-span-12 sm:col-span-8 md:col-span-5 lg:col-span-6  sm:rounded-tr-xl sm:rounded-br-xl rounded-xl  bg-white-component h-[calc(100vh-4rem)]  ">
          <Outlet />
        </div>

        {/* Right section: Edit Section */}
        <div className="hidden md:block md:col-span-4 lg:col-span-3 h-full bg-input-color rounded-xl">
          <div className="bg-gray-200 h-full">
            <Profile />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
