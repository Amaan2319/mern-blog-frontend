import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const AdminDashboard = () => {
  
  const { user, token } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("");
useEffect(() => {
  if (!user || user.role !== "admin") {
    navigate("/");
  }
}, [user, navigate]);


  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const [userRes, postRes] = await Promise.all([
          axios.get("https://mern-blog-9xkb.onrender.com/api/auth/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://mern-blog-9xkb.onrender.com/api/posts"), // public route
        ]);

        setUsers(userRes.data.users || []);
        setPosts(postRes.data || []);
      } catch (err) {
        console.error(
          "Error fetching data frontend:",
          err.response?.data || err
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleDeleteClick = (id, type) => {
    setItemToDelete(id);
    setDeleteType(type);
    setShowConfirmModal(true);
  };

  const confirmDeletion = async () => {
    try {
      if (deleteType === "user") {
        await axios.delete(
          `https://mern-blog-9xkb.onrender.com/api/auth/users/delete/${itemToDelete}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(users.filter((u) => u._id !== itemToDelete));
      } else if (deleteType === "post") {
        await axios.delete(
          `https://mern-blog-9xkb.onrender.com/api/posts/${itemToDelete}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(posts.filter((p) => p._id !== itemToDelete));
      }
    } catch (err) {
      console.error("Error deleting item:", err.response?.data || err);
    } finally {
      setShowConfirmModal(false);
      setItemToDelete(null);
      setDeleteType("");
    }
  };

  const cancelDeletion = () => {
    setShowConfirmModal(false);
    setItemToDelete(null);
    setDeleteType("");
  };

  if (loading) return <p className="text-center">Loading dashboard...</p>;

return (
  <div className="p-6 min-h-screen bg-base-200">
    <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

    {/* Users Section */}
    <div className="mb-12">
      <h3 className="text-2xl font-semibold mb-4">Manage Users</h3>
      <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
        <div className="h-[400px] overflow-y-auto">
          <table className="table w-full">
            <thead className="sticky top-0 bg-base-200 z-10">
              <tr className="font-extrabold text-gray-50 text-xl">
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      {u.role !== "admin" && u._id !== user.id && (
                        <button
                          onClick={() => handleDeleteClick(u._id, "user")}
                          className="btn btn-error btn-xs"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Posts Section */}
    <div>
      <h3 className="text-2xl font-semibold mb-4">Manage Posts</h3>
      <div className="overflow-x-auto bg-base-100 shadow rounded-lg">
        <div className="max-h-96 overflow-y-auto">
          <table className="table w-full">
            <thead>
              <tr className="font-extrabold text-white text-xl">
                <th>Title</th>
                <th>Author</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? (
                posts.map((p) => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>{p.createdBy?.username || "Deleted User"}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteClick(p._id, "post")}
                        className="btn btn-error btn-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Custom Confirmation Modal */}
    {showConfirmModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center">
          <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
          <p className="mb-6">
            Are you sure you want to delete this {deleteType}?
          </p>
          <div className="flex justify-center space-x-4">
            <button onClick={cancelDeletion} className="btn btn-neutral">
              Cancel
            </button>
            <button
              onClick={confirmDeletion}
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

export default AdminDashboard;


