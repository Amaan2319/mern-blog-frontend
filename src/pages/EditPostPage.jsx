import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSinglePost, updatePost } from "../features/auth/PostSlice";

const EditPostPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singlePost, status, error } = useSelector((state) => state.posts);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    dispatch(fetchSinglePost(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (singlePost) {
      setFormData({
        title: singlePost.title,
        content: singlePost.content,
      });
    }
  }, [singlePost]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(updatePost({ id, postData: formData })).unwrap();
      navigate("/dashboard");
    } catch (err) {
      alert(err || "Failed to update post");
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-xl mx-auto p-8 bg-base-100 shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Edit Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="textarea textarea-bordered h-48 w-full"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="btn btn-neutral"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;
