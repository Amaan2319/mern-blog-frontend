import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserPosts, deletePost } from "../features/auth/PostSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { posts, status, error } = useSelector((state) => state.posts);
  const [showConfirm, setShowConfirm] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  useEffect(() => {
    if (!user) {
      // Redirect if no user is logged in
      navigate("/login");
    } else if (status === "idle") {
      // Fetch user-specific posts only when the component mounts and state is idle
      dispatch(fetchUserPosts());
    }
  }, [user, navigate, dispatch, status]);

  const handleDeleteClick = (postId) => {
    setPostIdToDelete(postId);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    dispatch(deletePost(postIdToDelete));
    setShowConfirm(false);
    setPostIdToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setPostIdToDelete(null);
  };

  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
         <span className="loading loading-spinner text-primary"></span>
         <p className="ml-2">Loading posts...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
         <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-4xl mx-auto p-6 bg-base-100 shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Dashboard</h2>

        <p className="text-center text-lg mb-8">
          Welcome,{" "}
          <span className="text-xl  text-amber-700">{user.username || user.email}</span> !
          Manage your blogs here.
        </p>

        {posts.length > 0 ? (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li
                key={post._id} // Fix: Changed from post.id to post._id
                className="p-6 bg-base-200 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{post.title}</h3>

                  <p className="text-sm text-gray-500">
                    Posted on: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex space-x-2 mt-4 md:mt-0">
                  <button
                    onClick={() => handleEdit(post._id)}
                    className="btn btn-sm btn-info"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteClick(post._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500">
            <p>You haven't created any posts yet. Start by creating one!</p>

            <button
              onClick={() => navigate("/add-post")}
              className="btn btn-primary mt-4"
            >
              Create Post
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-8 rounded-lg shadow-xl text-center">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>

            <p className="mb-6">Are you sure you want to delete this post?</p>

            <div className="flex justify-center space-x-4">
              <button onClick={cancelDelete} className="btn btn-neutral">
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="btn btn-error text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
