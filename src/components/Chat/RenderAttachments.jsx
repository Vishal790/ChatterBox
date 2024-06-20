import React from "react";
import { transformImage } from "../../utils/features";
import { FileOpen } from "@mui/icons-material";

const RenderAttachments = ({ file, url }) => {
  let attachment;

  switch (file) {
    case "video":
    return <video src={url} preload="none" controls width={"200px"} />;
    
    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          alt="Attachment"
          width={"200px"}
          height={"150px"}
          style={{ objectFit: "contain" }}
          className=" p-2"
        />
      );
      
    case "audio":
     return attachment = <audio src={url} preload="none" controls />;
    
    default:
     return<FileOpen />;
  }

 
};

export default RenderAttachments;
