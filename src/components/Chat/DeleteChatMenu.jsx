import { Menu, Stack } from '@mui/material'
import React from 'react'
import { setIsDeleteMenu, setSelectedDeleteChat } from '../../redux/slices/miscSlice';
import { useSelector } from 'react-redux';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import toast from 'react-hot-toast';
import { deleteChat, leaveGroup } from '../../services/operations/chat';


const DeleteChatMenu = ({dispatch,deleteAnchor}) => {
  const {token} = useSelector((state)=>state.auth);

    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false))
    };
   
    const {isDeleteMenu, selectedDeleteChat } = useSelector((state) => state.misc);
    
    const deleteChatHandler = async() => {
      closeHandler();
      try{
       const response = await deleteChat(token,selectedDeleteChat.chatId);
       console.log(response);
      }
      catch(error){
         console.log(error.message);
      }
    };

    const leaveGroupHandler = async()=>{
        closeHandler();
      try {
       /// console.log("selected chat id",chatId);
     const response = await leaveGroup(token, selectedDeleteChat.chatId);
        
      } catch (error) {
        console.log(error.message);
      }
    }
  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteAnchor.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "left",
      }}
    >
      <div className=" flex cursor-pointer p-2"
      onClick={selectedDeleteChat.groupChat? leaveGroupHandler: deleteChatHandler}
      >
        {selectedDeleteChat.groupChat ? (
          <div className=" flex gap-x-2">
            <ExitToAppIcon />
            Leave Group
          </div>
        ) : (
          <div className=" flex gap-x-3"><DeleteForeverIcon/>Delete Chat</div>
        )}
      </div>
    </Menu>
  );
}

export default DeleteChatMenu