import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log("Navbar user: ", user);

  const handleLogout = () => {
    dispatch(logout());
    // Redirect to the login page after logout
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-md">
      {/* Left */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          MyBlog
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {user && (
            <>
              <li className="btn-primary">
                <Link to="/add-post">Add Post</Link>
              </li>

              {user.role === "admin" ? (
                <li>
                  <Link to="/admin-dashboard">Admin</Link>
                </li>
              ) : (
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
              )}
            </>
          )}

          {!user ? (
            <>
              <li className="btn-primary">
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout} className="btn-error text-red-700">
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      <div className="dropdown dropdown-end lg:hidden">
        <div tabIndex={0} role="button" className="btn btn-ghost">
          {/* Hamburger Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          {user && (
            <>
              <li>
                <Link to="/add-post">Add Post</Link>
              </li>

              {user.role === "admin" ? (
                <li>
                  <Link to="/admin-dashboard">Admin</Link>
                </li>
              ) : (
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
              )}
            </>
          )}

          {!user ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="btn btn-xs btn-error text-white"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
