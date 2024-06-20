import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationsCount: 0,
  // newMessagesAlert: [
  //   {
  //     chatId: "",
  //     count: 0,
  //   },
  // ],
  newMessagesAlert: JSON.parse(localStorage.getItem("newMessagesAlert")) || [],
  

};
const saveAlertsToLocalStorage = (alerts) => {
  localStorage.setItem("newMessagesAlert", JSON.stringify(alerts));
};
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotification: (state) => {
      state.notificationsCount += 1;
    },
    decrementNotification: (state) => {
      state.notificationsCount -= 1;
    },
    resetNotificationCount: (state) => {
      state.notificationsCount = 0;
    },

    setNewMessagesAlert: (state, action) => {
      const index = state.newMessagesAlert.findIndex(
        (item) => item.chatId === action.payload.chatId
      );
      if (index !== -1) {
        state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          chatId: action.payload.chatId,
          count: 1,
        });
      }
     saveAlertsToLocalStorage(state.newMessagesAlert);

    },
    resetMessagesAlert: (state, action) => {
      state.newMessagesAlert = state.newMessagesAlert.filter(
        (item) => item.chatId !== action.payload.chatId
      );
     saveAlertsToLocalStorage(state.newMessagesAlert);

    },
  },
});

export const {
  incrementNotification,
  decrementNotification,
  setNewMessagesAlert,
  resetNotificationCount,
  resetMessagesAlert,
} = chatSlice.actions;
export default chatSlice.reducer;
