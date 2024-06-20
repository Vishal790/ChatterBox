
import {userEndpoints}from "../apis"
import { useDispatch } from 'react-redux';
import { apiConnector } from '../apiConnector';
import toast from "react-hot-toast";




const {
  PROFILE_API,
  SEARCH_API,
  SEND_REQUEST_API,
  HANDLE_REQUEST_API,
  NOTIFICATIONS_API,
  FRIENDS_API,
} = userEndpoints;


export const getProfile = async (user, token) => {
  try {
    const response = await apiConnector("GET", PROFILE_API, null,
     {
      Authorization: `Bearer ${token}`, 
    },
  );

    // Assuming your API returns response.data.data as the user details
    const userDetails = response.data.data;

    return userDetails;
  } catch (error) {
    // Handle errors here
    console.error("Error fetching profile:", error);
    throw error;
  }
};


export const searchUsers = async (name, token) => {
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector(
      "GET",
      `${SEARCH_API}?name=${name}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("SEARCH_API_RESPONSE...........", response.data.data);

    if (!response.data.success) {
      throw new Error(response.message);
    }

    toast.success(response.data.message);
    toast.dismiss(toastId);

    return response.data.data;
  } catch (error) {
    toast.error(error.message || "An error occurred");
    toast.dismiss(toastId);
  }
};

export const sendFriendRequest = async (id, token) => {

 // console.log("IDDDD",id);
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "POST",
      `${SEND_REQUEST_API}`,
       { userId: id },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("SEND_REQUEST_API_RESPONSE...........", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message);
    toast.dismiss(toastId);

    return response.data.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || error.message || "An error occurred"
    );
    toast.dismiss(toastId);
  }
};

export const getAllNotifications = async (token) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("GET", `${NOTIFICATIONS_API}`, null, {
      Authorization: `Bearer ${token}`,
    });

    console.log("GET_NOTIFICATIONS_RESPONSE:", response.data.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message);
    toast.dismiss(toastId);

    return response.data.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || error.message || "An error occurred"
    );
    toast.dismiss(toastId);
  }
};


export const handleFriendRequest = async (token,_id, accept) => {
  //  return (dispatch) => { 

     const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "PUT",
      `${HANDLE_REQUEST_API}`,
      { requestId: _id, action: accept },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("HANDLE_REQUEST_API_RESPONSE:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message);
    toast.dismiss(toastId);
    
    getAllNotifications(token);
    //here u can also close the notifications tab;

    return response.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || error.message || "An error occurred"
    );
    toast.dismiss(toastId);
  }
 
};


export const fetchMyFriends= async (token) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("GET", `${FRIENDS_API}`, null, {
      Authorization: `Bearer ${token}`,
    });

   // console.log("FRIENDS_API_RESPONSE:", response.data.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message);
    toast.dismiss(toastId);

    return response.data.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || error.message || "An error occurred"
    );
    toast.dismiss(toastId);
  }
};