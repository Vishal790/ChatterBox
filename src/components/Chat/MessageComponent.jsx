import moment from "moment";
import React, { memo } from "react";
import { fileFormat, transformImage } from "../../utils/features";
import RenderAttachments from "./RenderAttachments";
import {motion} from "framer-motion"

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments, createdAt } = message;

  //console.log(attachments);
  const sameSender = sender?._id === user._id;
  

   const timeAgo = moment(createdAt).fromNow();
   const exactTime = moment(createdAt).format("dddd, h:mm A");
   const displayTime = `${timeAgo} - ${exactTime}`;



  //console.log(createdAt);


  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      className={`${
        sameSender
          ? "self-end bg-sender-message text-white"
          : "self-start bg-receiver-message "
      } p-1 px-2 flex flex-col justify-center items-center  mt-2 rounded-lg max-w-[70%]`}
    >
      {!sameSender && (
        <p className=" font-semibold  mb-1 text-s italic text-blue-400">
          {sender.name}
        </p>
      )}
      {content && (
        <h3
          className="overflow-auto "
          style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            display: "block", // Ensure the element is block-level for better wrapping
          }}
        >
          {content}
        </h3>
      )}
      {attachments &&
        attachments.length > 0 &&
        attachments.map((attachment, i) => {
          const url = attachment.url;
          const file = fileFormat(url);

          //   console.log("url is", url);

          return (
            <div key={i}>
              <a href={url} target="_blank" download style={{ color: "black" }}>
                <RenderAttachments file={file} url={url} />
              </a>
            </div>
          );
        })}
      <h4
        className={`${
          sameSender ? " text-white" : " text-pure-greys-200"
        } text-xs px-1 py-1`}
      >
        {displayTime}
      </h4>
    </motion.div>
  );
};

export default memo(MessageComponent);
