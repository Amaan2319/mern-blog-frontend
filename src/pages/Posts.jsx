import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPosts, deletePost } from "../features/auth/PostSlice";

const Posts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
const { allPosts, status, error } = useSelector((state) => state.posts);

  const { user } = useSelector((state) => state.auth);
  console.log("Posts in Redux state:", allPosts); // <-- Add this
// console.log("Current user:", user)

  // Local state for delete confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  useEffect(() => {
    // Fetch posts only once on mount
    dispatch(fetchPosts());
  }, [dispatch]);

  // Delete handling
  const handleDeleteClick = (postId) => {
    setPostIdToDelete(postId);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (postIdToDelete) {
      dispatch(deletePost(postIdToDelete));
    }
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

  // Loading and error states
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

  // Sort posts by date (latest first)
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );


  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">All Posts</h2>

        {allPosts.length === 0 && (
          <div className="alert">
            <span>No posts yet.</span>
          </div>
        )}

        {allPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((p) => {
              console.log("Rendering post:", p);
              return (
                <div key={p._id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">{p.title}</h3>
                    <p className="opacity-80">
                      {(p.content || "").length > 160
                        ? `${p.content.slice(0, 160)}…`
                        : p.content}
                    </p>

                    {/* Show author */}
                    <p className="text-sm text-gray-500 mt-2">
                      Posted by{" "}
                      <span className="font-medium">
                        {p.createdBy?.username || "Deleted User"}
                      </span>
                    </p>

                    <div className="card-actions justify-between mt-4">
                      {/* Show Edit/Delete only if logged-in user is the author */}
                      {user &&
                        p.createdBy &&
                        String(p.createdBy._id) === String(user.id) && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(p._id)}
                              className="btn btn-outline btn-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(p._id)}
                              className="btn btn-error btn-sm text-white"
                            >
                              Delete
                            </button>
                          </div>
                        )}

                      <button
                        onClick={() => navigate(`/posts/${p._id}`)}
                        className="btn btn-primary btn-sm"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
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

export default Posts;
