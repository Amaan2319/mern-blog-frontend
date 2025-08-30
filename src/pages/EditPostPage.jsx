import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSinglePost, updatePost } from "../features/auth/PostSlice"; // Assuming these actions exist

const EditPostPage = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Get the post and status from the Redux store

  const { posts, status, error } = useSelector((state) => state.posts); // Find the specific post from the array of posts

  const postToEdit = posts.find((p) => p._id === id); // State for the form inputs

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  }); // Populate the form when the component mounts or the post data becomes available

  useEffect(() => {
    if (postToEdit) {
      setFormData({
        title: postToEdit.title,
        content: postToEdit.content,
      });
    } else if (id) {
      // If the post is not in the store, fetch it by its ID
      dispatch(fetchSinglePost(id));
    }
  }, [postToEdit, id, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Dispatch the updatePost action with the post ID and updated data
    dispatch(updatePost({ id, postData: formData })).then(() => {
      // Navigate back to the dashboard after a successful update
      navigate("/dashboard");
    });
  }; // Handle loading and error states

  if (status === "loading" && !postToEdit) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-primary"></span>
        <p className="ml-2">Loading post...</p>
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
      
      <div className="max-w-xl mx-auto p-8 bg-base-100 shadow-xl rounded-lg">
      
        <h2 className="text-3xl font-bold mb-6 text-center">Edit Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
         {" "}
          <div>
            
            <label htmlFor="title" className="label">
               <span className="label-text">Title</span>
            </label>
            
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post Title"
              className="input input-bordered w-full"
              required
            />

          </div>

          <div>
            <label htmlFor="content" className="label">
             <span className="label-text">Content</span>

            </label>
            
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Post Content"
              className="textarea textarea-bordered h-48 w-full"
              required
            ></textarea>
           
          </div>
         
          <div className="flex justify-end space-x-2">
         
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
