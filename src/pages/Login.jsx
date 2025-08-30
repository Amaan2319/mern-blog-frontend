// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset } from "../features/auth/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get state from Redux store
  const { user, isError, message, isLoading } = useSelector(
    (state) => state.auth
  );

  // Use useEffect to handle side effects after state changes
 useEffect(() => {
   if (isError) {
     console.error(message);
   }
   if (user) {
     if (user.role === "admin") {
       navigate("/admin-dashboard");
     } else {
       navigate("/dashboard");
     }
   }
   return () => {
     dispatch(reset());
   };
 }, [user, isError, message, navigate, dispatch]);


  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch the async thunk with form data
    dispatch(login(formData));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          {isError && <p className="text-red-500">{message}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="input input-bordered"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="input input-bordered"
              value={formData.password}
              onChange={handleChange}
            />
            <button className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
