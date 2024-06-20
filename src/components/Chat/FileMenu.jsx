import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setIsUploading } from "../../redux/slices/miscSlice";
import CloseIcon from "@mui/icons-material/Close";
import { AudioFile, Image, UploadFile, VideoFile } from "@mui/icons-material";
import toast from "react-hot-toast";
import { sendAttachments } from "../../services/operations/chat";
import { useParams } from "react-router-dom";

const FileMenu = ({ onClose }) => {
  const dispatch = useDispatch();
  const chatId = useParams().chatId;
  const { token } = useSelector((state) => state.auth);

  const closeFileMenu = () => {
    dispatch(setIsFileMenu(false));
  };

  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const fileRef = useRef(null);

  // const selectRef = (ref) => {
  //   ref.current?.click();
  //   dispatch(setIsFileMenu(false));
  // };

  const fileChangeHandler = async (e, key) => {
          dispatch(setIsFileMenu(false)); 

    const files = Array.from(e.target.files);
    console.log("Selected files:", files);
    if (files.length <= 0) return;
    if (files.length > 5)
      return toast.error("Maximum number of files supported is 5");

    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("chatId", chatId);
      files.forEach((file) => formData.append("files", file));
      dispatch(setIsUploading(true));
      dispatch(setIsFileMenu(false)); 

      const response = await sendAttachments(token,formData);
      console.log("Attachments sent successfully:", response);
      dispatch(setIsUploading(false));

    } catch (error) {
      console.error("Error sending attachments:", error);
      dispatch(setIsUploading(false));
      dispatch(setIsFileMenu(false)); 


    }
  };

  return (
    <div className="absolute w-[150px] flex flex-col bottom-0 transform translate-x-[30%] -translate-y-[20%] rounded-xl bg-richblack-900 text-richblack-5 border shadow-md py-1">
      <div className="flex p-1 gap-x-3 justify-center items-center mb-3">
        <p className="flex gap-3">Select Files</p>
        <button onClick={closeFileMenu}>
          <CloseIcon />
        </button>
      </div>

      <label
        htmlFor="imageInput"
        className="min-w-full flex items-center px-7 mx-auto justify-around cursor-pointer"
      >
        <Image />
        <span className="block w-full text-center px-4 py-2 hover:bg-gray-100">
          Image
        </span>
        <input
          id="imageInput"
          type="file"
          multiple
          accept="image/png,image/jpeg,image/gif"
          className="hidden"
         
          onChange={(e) => fileChangeHandler(e, "Images")}
         
        />
      </label>

      <label
        htmlFor="audioInput"
        className="min-w-full flex items-center px-7 mx-auto justify-around cursor-pointer"
      >
        <AudioFile />
        <span className="block w-full text-center px-4 py-2 hover:bg-gray-100">
          Audio
        </span>
        <input
          id="audioInput"
          type="file"
          multiple
          accept="audio/mp3,audio/wav"
          className="hidden"
          onChange={(e) => fileChangeHandler(e, "Audio")}
       
        />
      </label>

      <label
        htmlFor="videoInput"
        className="min-w-full flex items-center px-7 mx-auto justify-around cursor-pointer"
      >
        <VideoFile />
        <span className="block w-full text-center px-4 py-2 hover:bg-gray-100">
          Video
        </span>
        <input
          id="videoInput"
          type="file"
          multiple
          accept="video/mp4,video/ogg,video/webm"
          className="hidden"
          onChange={(e) => fileChangeHandler(e, "Videos")}
         
        />
      </label>

      <label
        htmlFor="fileInput"
        className="min-w-full flex items-center px-7 mx-auto justify-around cursor-pointer"
      >
        <UploadFile />
        <span className="block w-full text-center px-4 py-2 hover:bg-gray-100">
          File
        </span>
        <input
          id="fileInput"
          type="file"
          multiple
          accept="*"
          className="hidden"
          onChange={(e) => fileChangeHandler(e, "Files")}
        />
      </label>
    </div>
  );
};

export default FileMenu;
