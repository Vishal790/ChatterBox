import { Typography } from "@mui/material";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import AvatarCard from "./AvatarCard";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../../redux/slices/miscSlice";
import{motion} from"framer-motion"

const ChatItem = ({
  data,
  avatar,
  name,
  _id,
  groupchat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {

 const handleClick = () => {
    if (isMobile) {
      dispatch(setIsMobile(false));
    }
  }

const dispatch = useDispatch();
const {isMobile} = useSelector((state)=>state.misc);
  
  return (
    <motion.div 
    initial={{opacity:0,y:"-100%"}}
    whileInView={{opacity:1,y:'0'}}
    transition={{delay: index*0.1}}
    className={`mb-1 overflow-x-hidden`}>
      <Link
        to={`/chat/${_id}`}
        className={`block p-4   border-richblack-800 relative  ${
          sameSender
            ? "bg-receiver-message text-text-color "
            : " bg-white-component text-text-color"
        } ${!sameSender && "hover:bg-receiver-message "} `}
        onClick={handleClick}
        onContextMenu={(e) => handleDeleteChat(e, _id, groupchat)}
      >
        <div className="flex items-center">
          <div>
            <AvatarCard avatar={avatar} />
          </div>
          <div className="ml-4">
            <div className="flex flex-col items-center">
              <h1 className="mr-2">{data.name}</h1>
              {newMessageAlert && <h2 className="text-xs text-pure-greys-600">{newMessageAlert.count} New Messages</h2>}
            </div>
          </div>
        </div>
        {isOnline && !groupchat&&(
          <div
            className="w-[10px] h-[10px] rounded-full bg-caribbeangreen-400"
            style={{
              position: "absolute",
              left: "calc(100% - 15px)", // Adjusted position
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </Link>
    </motion.div>
  );
};

export default memo(ChatItem);
