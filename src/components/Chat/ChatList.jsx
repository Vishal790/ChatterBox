import React, { useState } from "react";
import ChatItem from "./ChatItem";
import { useSelector } from "react-redux";

const ChatList = ({
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <div className="">
      {chats.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;
        const newMessageAlert = newMessagesAlert.find(
          (alert) => alert.chatId === _id
        );

        //  console.log("new messages alert", newMessageAlert);

          // console.log("Members:", members);
          // console.log("OnlineUsers:", onlineUsers);

        const isOnline = members.some((memberId) => {
       //   console.log("Member ID:", memberId); // Log each member's ID
          return onlineUsers.includes(memberId);
        });
      //  console.log("ISONLINE", isOnline);

        return (
          <ChatItem
            data={data}
            index={index}
            avatar={avatar}
            _id={_id}
            name={name}
            key={_id}
            groupchat={groupChat}
            members={members}
            sameSender={chatId === _id}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </div>
  );
};

export default ChatList;
