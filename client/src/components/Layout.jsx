import { Link, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>CareNest</h2>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/children">Children</Link>
        <Link to="/vaccinations">Vaccination</Link>
        <Link to="/growth">Growth</Link>

        {/* 🔥 Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: "#ff4d4d",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default Layout;