import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    isAuthenticated: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user ?? state.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
