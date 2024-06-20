import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { SampleNotifications } from "../SampleData/sampleData";
import NotificationItem from "./NotificationItem";
import {
  getAllNotifications,
  handleFriendRequest,
} from "../../services/operations/user";
import Spinner from "../utils/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotifications } from "../../redux/slices/miscSlice";
import { decrementNotification } from "../../redux/slices/chatSlice";
import { useNavigate, useParams } from "react-router-dom";





const Notifications = () => {
const navigate = useNavigate();
const chatId = useParams().chatId;
console.log("CHATid from notifications",chatId);


  const [notifications,setNotifications] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const {token} = useSelector((state)=>state.auth);





 useEffect(()=>{
  const fetchNotifications = async () => {
   try {
     const response = await getAllNotifications();

     if (response) {
       setNotifications(response);
     }

     setIsLoading(false);
   } catch (error) {
     console.error("Error fetching notifications:", error);
     setIsLoading(false);
   }
 };

 fetchNotifications();

},[]);

const friendRequestHandler = async ({ _id, accept }) => {
  try {
    const response = await handleFriendRequest(token, _id, accept);

    if (response) {
    //  console.log("Friend request handled successfully:", response);

      // // Assuming you need to update notifications after handling request
      // const updatedNotifications = notifications.filter(
      //   (notification) => notification._id !== _id
      // );
      // setNotifications(updatedNotifications);

      // Trigger Redux actions to update notification count or other state
      // dispatch(decrementNotification());
      dispatch(setIsNotifications(false));
    }
  } catch (error) {
    console.error("Error handling friend request:", error);
  }
};




  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-filter backdrop-blur-sm">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white p-4 rounded-lg  max-h-[500px] w-[25rem]  ">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold mx-auto text-center">
            Notifications
          </h1>
          <button className="text-gray-500 hover:text-gray-700" onClick={()=>dispatch(setIsNotifications(false))}>
            <CloseIcon />
          </button>
        </div>
        <div className=" max-h-[400px] scrollbar-thin scrollbar-track-richblack-25 scrollbar-thumb-richblack-300 overflow-auto">
          {isLoading ? (
            <Spinner />
          ) : notifications.length > 0 ? (
            <div className="h-full overflow-auto">
              {notifications &&
                notifications.map((i) => (
                  <NotificationItem
                    sender={i}
                    _id={i._id}
                    handler={friendRequestHandler}
                    key={i._id}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center font-semibold text-l">No Notifications</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
