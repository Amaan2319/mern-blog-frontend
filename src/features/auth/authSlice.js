// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api";

// // Fetch all posts for the home page
// export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
//   const res = await axios.get(`${API_URL}/posts`);
//   return res.data;
// });

// // Create a new post
// export const createPost = createAsyncThunk(
//   "posts/createPost",
//   async ({ title, content, token }, thunkAPI) => {
//     try {
//       const res = await axios.post(
//         `${API_URL}/posts`,
//         { title, content },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return res.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Fetch posts specifically for the logged-in user's dashboard
// export const fetchUserPosts = createAsyncThunk(
//   "posts/fetchUserPosts",
//   async (_, thunkAPI) => {
//     try {
//       const { token } = thunkAPI.getState().auth;
//       const res = await axios.get(`${API_URL}/posts/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Delete a post
// export const deletePost = createAsyncThunk(
//   "posts/deletePost",
//   async (postId, thunkAPI) => {
//     try {
//       const { token } = thunkAPI.getState().auth;
//       await axios.delete(`${API_URL}/posts/${postId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return postId; // Return the ID of the deleted post
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// const postsSlice = createSlice({
//   name: "posts",
//   initialState: {
//     posts: [],
//     status: "idle",
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch all posts
//       .addCase(fetchPosts.pending, (state) => { state.status = "loading"; })
//       .addCase(fetchPosts.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.posts = action.payload;
//       })
//       .addCase(fetchPosts.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })
//       // Create a post
//       .addCase(createPost.pending, (state) => { state.status = "loading"; })
//       .addCase(createPost.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.posts.push(action.payload);
//       })
//       .addCase(createPost.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       // Fetch user-specific posts
//       .addCase(fetchUserPosts.pending, (state) => { state.status = "loading"; })
//       .addCase(fetchUserPosts.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.posts = action.payload;
//       })
//       .addCase(fetchUserPosts.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       // Delete a post
//       .addCase(deletePost.fulfilled, (state, action) => {
//         state.posts = state.posts.filter((post) => post._id !== action.payload);
//       })
//       .addCase(deletePost.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   },
// });

// export default postsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// This is the base URL for your backend API
const API_URL = "https://mern-blog-9xkb.onrender.com/api/auth";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const initialState = {
  // Check localStorage for a user, otherwise set to null
  user: user ? user : null,
  // Check localStorage for a token
  token: token || null,
  // Set initial state for async operations
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Async thunk for user registration
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + "/register", userData);
      // Check if data exists in the response
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      // Handle different types of errors from the API
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      // Use thunkAPI.rejectWithValue to pass the error message to the reducer
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for user login
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + "/login", userData);
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for user logout
export const logout = createAsyncThunk("auth/logout", async () => {
  // In a real application, you might also call a logout endpoint
  // await axios.post(API_URL + "/logout");
  localStorage.removeItem("user");
  localStorage.removeItem("token");
});

// Create the auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // A regular reducer to reset state back to its initial value
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Reducer for the 'register' thunk
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // Reducer for the 'login' thunk
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      // Reducer for the 'logout' thunk
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isSuccess = true;
      });
  },
});

// Export the reset action and the reducer
export const { reset } = authSlice.actions;
export default authSlice.reducer;
