// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api";

// export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
//   const res = await axios.get(`${API_URL}/posts`);
//   return res.data;
// });

// export const createPost = createAsyncThunk("posts/createPost", async ({ title, content, token }) => {
//   const res = await axios.post(`${API_URL}/posts`, { title, content }, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return res.data;
// });

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
//       .addCase(fetchPosts.pending, (state) => { state.status = "loading"; })
//       .addCase(fetchPosts.fulfilled, (state, action) => { state.status = "succeeded"; state.posts = action.payload; })
//       .addCase(fetchPosts.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; });
//   },
// });

// export default postsSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://mern-blog-9xkb.onrender.com/api";

// Fetch all posts from the backend
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await axios.get(`${API_URL}/posts`);
  return res.data;
});

// Create a new post and send it to the backend
export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ title, content, token }, thunkAPI) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(`${API_URL}/posts`, { title, content }, config);
      return res.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch posts specifically for the logged-in user's dashboard
export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (_, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth;
      const res = await axios.get(`${API_URL}/posts/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Fetched user posts:", res.data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch a single post by ID
export const fetchSinglePost = createAsyncThunk(
  "posts/fetchSinglePost",
  async (postId, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth;
      const res = await axios.get(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update an existing post on the backend
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, postData }, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.put(`${API_URL}/posts/${id}`, postData, config);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete a post from the backend
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth;
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return postId; // Return the ID of the deleted post
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload; // Update the posts array with all posts
        console.log("Fetched posts:", action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Cases for createPost
      .addCase(createPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        // The payload from the backend is now a single, populated post object.
        // We can safely push it directly to the state.
        state.posts.push(action.payload);
        console.log("Created post:", action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Use action.payload for the rejected value
      })
      // Cases for fetchUserPosts
      .addCase(fetchUserPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Cases for deletePost
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default postsSlice.reducer;
