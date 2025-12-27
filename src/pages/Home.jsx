  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import { fetchPosts, deletePost } from "../features/auth/PostSlice";

  const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allPosts, status, error } = useSelector((state) => state.posts);
    const { user } = useSelector((state) => state.auth);

    const [showConfirm, setShowConfirm] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);

    useEffect(() => {
      dispatch(fetchPosts());
    }, [dispatch]);

    const sortedPosts = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    if (status === "loading") {
      return <div className="text-center mt-10">Loading posts…</div>;
    }

    if (status === "failed") {
      return <div className="text-red-500 text-center">{error}</div>;
    }

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
              {sortedPosts.map((p) => (
                <div key={p._id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">{p.title}</h3>
                    <p className="opacity-80">
                      {p.content.length > 160
                        ? `${p.content.slice(0, 160)}…`
                        : p.content}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      Posted by{" "}
                      <span className="font-medium">
                        {p.createdBy?.username || "Deleted User"}
                      </span>
                    </p>

                    <div className="card-actions justify-between mt-4">
                      {user &&
                        p.createdBy &&
                        String(p.createdBy._id) === String(user.id) && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/edit-post/${p._id}`)}
                              className="btn btn-outline btn-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setPostIdToDelete(p._id);
                                setShowConfirm(true);
                              }}
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
              ))}
            </div>
          )}
        </div>
        {/* Delete confirmation modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg shadow-xl text-center">
              <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
              <p className="mb-6">Are you sure you want to delete this post?</p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setPostIdToDelete(null);
                  }}
                  className="btn btn-neutral"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    dispatch(deletePost(postIdToDelete));
                    setShowConfirm(false);
                    setPostIdToDelete(null);
                  }}
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

  export default Home;
