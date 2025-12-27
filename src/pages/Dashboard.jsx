import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserPosts, deletePost } from "../features/auth/PostSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { userPosts, status, error } = useSelector((state) => state.posts);

  const [showConfirm, setShowConfirm] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(fetchUserPosts());
    }
  }, [user, dispatch, navigate]);

  const confirmDelete = () => {
    dispatch(deletePost(postIdToDelete));
    setShowConfirm(false);
    setPostIdToDelete(null);
  };

  if (status === "loading") {
    return <div className="text-center mt-10">Loading your posts…</div>;
  }

  if (status === "failed") {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-base-100 rounded shadow">
      <h2 className="text-3xl font-bold text-center mb-6">Dashboard</h2>

      {userPosts.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven’t created any posts yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {userPosts.map((post) => (
            <li
              key={post._id}
              className="p-4 bg-base-200 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/edit-post/${post._id}`)}
                  className="btn btn-sm btn-info"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setPostIdToDelete(post._id);
                    setShowConfirm(true);
                  }}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded">
            <p className="mb-4">Delete this post?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowConfirm(false)} className="btn">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-error">
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
