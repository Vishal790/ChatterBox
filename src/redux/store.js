import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import miscReducer from "./slices/miscSlice";
import chatReducer from "./slices/chatSlice";


  const store = configureStore({
    reducer: {
      auth: authReducer,
      misc: miscReducer,
      chat: chatReducer,
    },
  });

  export default store;