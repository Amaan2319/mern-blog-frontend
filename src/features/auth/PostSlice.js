import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://mern-blog-9xkb.onrender.com/api";

const initialState = {
  allPosts: [],
  userPosts: [],
  singlePost: null,
  status: "idle",
  error: null,
};

// 🔓 Public feed
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await axios.get(`${API_URL}/posts`);
  return res.data;
});

// 🔐 User dashboard posts
export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const res = await axios.get(`${API_URL}/posts/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ➕ Create post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ title, content }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const res = await axios.post(
        `${API_URL}/posts`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ✏️ Update post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, postData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const res = await axios.put(
        `${API_URL}/posts/${id}`,
        postData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);


// ❌ Delete post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return postId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 🔎 Single post
export const fetchSinglePost = createAsyncThunk(
  "posts/fetchSinglePost",
  async (postId, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/posts/${postId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (s) => { s.status = "loading"; })
      .addCase(fetchPosts.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.allPosts = a.payload;
      })

      .addCase(fetchUserPosts.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.userPosts = a.payload;
      })

      .addCase(createPost.fulfilled, (s, a) => {
        s.userPosts.unshift(a.payload);
        s.allPosts.unshift(a.payload);
      })

      .addCase(updatePost.pending, (s) => {
        s.status = "loading";
      })
      .addCase(updatePost.fulfilled, (s, a) => {
        s.status = "succeeded";

        s.userPosts = s.userPosts.map(p =>
          p._id === a.payload._id ? a.payload : p
        );

        s.allPosts = s.allPosts.map(p =>
          p._id === a.payload._id ? a.payload : p
        );

        s.singlePost = a.payload;
      })
      .addCase(updatePost.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })


      .addCase(deletePost.fulfilled, (s, a) => {
        s.userPosts = s.userPosts.filter(p => p._id !== a.payload);
        s.allPosts = s.allPosts.filter(p => p._id !== a.payload);
      })

      .addCase(fetchSinglePost.fulfilled, (s, a) => {
        s.singlePost = a.payload;
      });
  },
});

export default postsSlice.reducer;
