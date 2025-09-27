import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_URL = "https://mern-blog-9xkb.onrender.com/api";

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setStatus("loading");
        const res = await axios.get(`${API_URL}/posts/${id}`);
        setPost(res.data);
        setStatus("succeeded");
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setStatus("failed");
      }
    };

    fetchPost();
  }, [id]);

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-3xl mx-auto">
        {status === "loading" && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}

        {status === "failed" && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Unable to load post</h2>
              <p className="text-error">{error}</p>
              <button onClick={() => navigate(-1)} className="btn mt-3">
                Go Back
              </button>
            </div>
          </div>
        )}

        {status === "succeeded" && post && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-3xl">{post.title}</h2>
              <div className="opacity-70 text-sm">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleString()
                  : null}
              </div>
              <p className="mt-4 whitespace-pre-line">{post.content}</p>
              <div className="card-actions justify-end mt-6">
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-secondary"
                >
                  Back to Posts
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePost;
