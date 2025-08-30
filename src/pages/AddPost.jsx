      // src/pages/AddPost.jsx

      import { useState } from "react";
      import { useDispatch, useSelector } from "react-redux";
      import { useNavigate } from "react-router-dom";
      import { createPost } from "../features/auth/PostSlice";

      const AddPost = () => {
        const [post, setPost] = useState({ title: "", content: "" });
        const [error, setError] = useState(null);

        // Get the auth token from the Redux store
        const { token } = useSelector((state) => state.auth);
        const dispatch = useDispatch();
        const navigate = useNavigate();

        const handleChange = (e) =>
          setPost({ ...post, [e.target.name]: e.target.value });

        const handleSubmit = async (e) => {
          e.preventDefault();

          if (!post.title || !post.content) {
            setError("Title and content are required.");
            return;
          }

          try {
            // Dispatch the createPost async thunk with the post data and token
            await dispatch(createPost({ ...post, token })).unwrap();

            // If the post is created successfully, navigate to the dashboard
            navigate("/dashboard");
          } catch (err) {
            setError("Failed to create post. Please try again.");
            console.error(err);
          }
        };

        return (
          <div className="flex justify-center items-center min-h-screen bg-base-200">
            <div className="card w-[90%] md:w-2/3 lg:w-1/2 bg-base-100 shadow-xl p-6">
              <h2 className="text-2xl font-bold text-center mb-4">Add Post</h2>
              {error && (
                <div className="alert alert-error mb-4">
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  name="title"
                  type="text"
                  placeholder="Post Title"
                  className="input input-bordered"
                  value={post.title}
                  onChange={handleChange}
                />
                <textarea
                  name="content"
                  placeholder="Post Content"
                  className="textarea textarea-bordered"
                  value={post.content}
                  onChange={handleChange}
                ></textarea>
                <button className="btn btn-primary" type="submit">
                  Publish
                </button>
              </form>
            </div>
          </div>
        );
      };

      export default AddPost;
