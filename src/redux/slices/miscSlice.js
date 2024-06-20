import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNewGroup: false,
  isAddMember: false,
  isNotifications:false,
  isMobile:false,
  isSearch:false,
  isFileMenu:false,
  isDeleteMenu:false,
  isUploading:false,
  selectedDeleteChat:{
    chatId:"",
    groupChat:false,
  }
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsNewGroup(state, action) {
      state.isNewGroup = action.payload;
    },
    setIsAddMember(state, action) {
      state.isAddMember = action.payload;
    },
    setIsNotifications(state, action) {
      state.isNotifications = action.payload;
    },
    setIsMobile(state, action) {
      state.isMobile = action.payload;
    },
    setIsSearch(state, action) {
      state.isSearch = action.payload;
    },
    setIsFileMenu(state, action) {
      state.isFileMenu = action.payload;
    },
    setIsDeleteMenu(state, action) {
      state.isDeleteMenu = action.payload;
    },
    setIsUploading(state, action) {
      state.isUploading = action.payload;
    },
    setSelectedDeleteChat(state, action) {
      state.selectedDeleteChat = action.payload;
    },
  },
});

export const {
  setIsNewGroup,
  setIsAddMember,
  setIsNotifications,
  setIsMobile,
  setIsSearch,
  setIsFileMenu,
  setIsDeleteMenu,
  setIsUploading,
  setSelectedDeleteChat,
} = miscSlice.actions;
export default miscSlice.reducer;
