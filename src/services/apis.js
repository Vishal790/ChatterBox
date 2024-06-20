const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authEndpoints = {
  SIGNUP_API: BASE_URL + "/signup",
  LOGIN_API: BASE_URL + "/login",
};

export const userEndpoints = {
  PROFILE_API: BASE_URL + "/profile",
  SEARCH_API: BASE_URL + "/search",
  SEND_REQUEST_API: BASE_URL + "/send-request",
  HANDLE_REQUEST_API: BASE_URL + "/handle-request",
  NOTIFICATIONS_API: BASE_URL + "/notifications",
  FRIENDS_API: BASE_URL + "/friends",
};


export const chatEndPoints = {
  NEW_GROUP_CHAT_API: `${BASE_URL}/groups`,
  GET_MY_CHATS_API: `${BASE_URL}/chats`,
  GET_MY_GROUPS_API: `${BASE_URL}/groups`,
  ADD_MEMBERS_API: `${BASE_URL}/addmembers`,
  REMOVE_MEMBER_API: `${BASE_URL}/removemember`,
  LEAVE_GROUP_API: `${BASE_URL}/leaveGroup`, // Use string template directly when calling
  SEND_ATTACHMENTS_API: `${BASE_URL}/message`,
  GET_MESSAGES_API: `${BASE_URL}/message`, // Use string template directly when calling
  GET_CHAT_DETAILS_API: `${BASE_URL}/chat`, // Use string template directly when calling
  RENAME_GROUP_API: `${BASE_URL}/chat`, // Use string template directly when calling
  DELETE_CHAT_API: `${BASE_URL}/chat`, // Use string template directly when calling
};