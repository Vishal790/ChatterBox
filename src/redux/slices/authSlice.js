import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  isAdmin: false,
  isLoading: false,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
  signupData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading(state, value) {
      state.isLoading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});





export const { setUser,setLoading,setToken } = authSlice.actions;
export default authSlice.reducer;
