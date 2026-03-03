import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));

    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      return <Navigate to="/login" />;
    }

    return children;
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;