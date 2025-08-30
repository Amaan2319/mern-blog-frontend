import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postsReducer from "../features/auth/PostSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer, // Add the posts reducer to the store
  },
});
