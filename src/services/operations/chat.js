import { toast } from "react-hot-toast";
import { chatEndPoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { useDispatch } from "react-redux";
import { setIsUploading } from "../../redux/slices/miscSlice";

const {
  NEW_GROUP_CHAT_API,
  GET_MY_CHATS_API,
  GET_MY_GROUPS_API,
  ADD_MEMBERS_API,
  REMOVE_MEMBER_API,
  LEAVE_GROUP_API,
  SEND_ATTACHMENTS_API,
  GET_MESSAGES_API,
  GET_CHAT_DETAILS_API,
  RENAME_GROUP_API,
  DELETE_CHAT_API,
} = chatEndPoints;

// export const getChats = async (token) => {
//   try {
//     const response = await apiConnector("GET", GET_MY_CHATS_API, null, {
//       Authorization: `Bearer ${token}`,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching chats:", error);
//     throw error;
//   }
// };

// export const getChatDetails = async (chatId, token) => {
//   try {
//     const response = await apiConnector(
//       "GET",
//       `${GET_CHAT_DETAILS_API}/${chatId}`,
//       null,
//       {
//         Authorization: `Bearer ${token}`,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching chat details:", error);
//     throw error;
//   }
// };

export const getChats = async (token) => {
  const toastId = toast.loading("Loading chats...");

  try {
    const response = await apiConnector("GET", GET_MY_CHATS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    //console.log("GET_MY_CHATS_API_RESPONSE...........", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    //  toast.success(response.data.message);
    toast.dismiss(toastId);

    return response.data;
  } catch (error) {
    toast.error(error.message || "An error occurred");
    toast.dismiss(toastId);
  }
};

export const getChatDetails = async (chatId, token) => {
  const toastId = toast.loading("Loading chat details...");

  try {
    const response = await apiConnector(
      "GET",
      `${GET_CHAT_DETAILS_API}/${chatId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    // console.log("GET_CHAT_DETAILS_API_RESPONSE...........", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    // toast.success(response.data.message);
    toast.dismiss(toastId);

    return response.data;
  } catch (error) {
    toast.error(error.message || "An error occurred");
    toast.dismiss(toastId);
  }
};

export const getMessages = async (token, chatId, page) => {
  const toastId = toast.loading("Loading messages...");
  if (page < 1) page = 1;

  try {
    const response = await apiConnector(
      "GET",
      `${GET_MESSAGES_API}/${chatId}?page=${page}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    //console.log("GET_MESSAGES_API_RESPONSE...........", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    //  toast.success(response.data.message);
    toast.dismiss(toastId);

    return response.data;
  } catch (error) {
    toast.error(error.message || "An error occurred");
    toast.dismiss(toastId);
  }
};

export const sendAttachments = async (token, data) => {
  const toastId = toast.loading("Sending attachments...");

  try {
    const response = await apiConnector(
      "POST",
      `${SEND_ATTACHMENTS_API}`,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("SEND_ATTACHMENTS_API_RESPONSE...........", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message);
    toast.dismiss(toastId);

    return response.data;
  } catch (error) {
    toast.error(error.message || "An error occurred");
    toast.dismiss(toastId);
  }
};

export const getMyGroups = async (token) => {
  const toastId = toast.loading("Loading Group details...");

  try {
    const response = await apiConnector("GET", `${GET_MY_GROUPS_API}`, null, {
      Authorization: `Bearer ${token}`,
    });

    // console.log("GET_MY_GROUPS_API_RESPONSE...........", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    // toast.success(response.data.message);
    toast.dismiss(toastId);

    return response.data;
  } catch (error) {
    toast.error(error.message || "An error occurred");
    toast.dismiss(toastId);
  }
};

export const createGroup = async (token, name, members) => {
  const toastId = toast.loading("Loading Group details...");
  try {
    const response = await apiConnector(
      "POST",
      `${NEW_GROUP_CHAT_API}`,
     {name: name, members: members},
      {
        Authorization: `Bearer ${token}`,
      }
    );

     console.log("NEW_GROUP_CHAT_API_RESPONSE...........", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    // toast.success(response.data.message);
    toast.dismiss(toastId);

   // return response.data;
  } catch (error) {
    toast.error(error.message || "An error occurred");
    toast.dismiss(toastId);
  }
};


export const renameGroup = async (token,chatId,name) => {
  console.log("name from apis",name);
  const toastId = toast.loading("Loading Group details...");
  try {
    const response = await apiConnector(
      "PUT",
      `${RENAME_GROUP_API}/${chatId}`,
      {name},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("RENAME_GROUP_API_RESPONSE...........", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message);
    toast.dismiss(toastId);

     return response.data;
  } catch (error) {
    toast.error(error.message || "An error occurred");
    toast.dismiss(toastId);
  }
};

export const removeMember = async (token, userId, chatId) => {

  const toastId = toast.loading("Loading Group details...");
  try {
    const response = await apiConnector(
      "PUT",
      `${REMOVE_MEMBER_API}`,
      { userId: userId, chatId: chatId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("REMOVE_MEMBER_API_RESPONSE...........", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message);
    toast.dismiss(toastId);

    return response.data;
  } catch (error) {
    toast.error(error.message || "An error occurred");
    toast.dismiss(toastId);
  }
};


export const addMember = async (token, chatId, members) => {
  const toastId = toast.loading("Loading Group details...");
  try {
    const response = await apiConnector(
      "PUT",
      `${ADD_MEMBERS_API}`,
      { chatId: chatId, members: members },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("ADD_MEMBERS_API_RESPONSE...........", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message);
    toast.dismiss(toastId);

    return response.data;
  } catch (error) {
    console.log(error.message);
    toast.error(error.message || "An error occurred");
    toast.dismiss(toastId);
  }
};

export const deleteChat = async (token, chatId) => {
  const toastId = toast.loading("Deleting Group..");
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_CHAT_API}/${chatId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("DELETE_CHAT_API_RESPONSE...........", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message);
    toast.dismiss(toastId);

    return response.data;
  } catch (error) {
    console.log(error.message);
    toast.error(response.data.message);
    toast.dismiss(toastId);
  }
};

export const leaveGroup = async (token, chatId) => {
  const toastId = toast.loading("Deleting Group..");
  try {
    const response = await apiConnector(
      "DELETE",
      `${LEAVE_GROUP_API}/${chatId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("LEAVE_GROUP_API_RESPONSE...........", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success(response.data.message);
    toast.dismiss(toastId);

    return response.data;
  } catch (error) {
    console.log(error.message);
    toast.error(error.message || "An error occurred");
    toast.dismiss(toastId);
  }
};

