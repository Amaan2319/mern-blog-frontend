import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!user || !token || user.role !== "admin") {
    // Not admin → redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
