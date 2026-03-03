import "./Auth.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Auto redirect if already logged in (role based)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));

        if (decoded.role === "doctor") {
          navigate("/doctor");
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/login", { email, password });

    console.log("FULL LOGIN RESPONSE:", res.data);

    const token = res.data.token;
    localStorage.setItem("token", token);

    const decoded = JSON.parse(atob(token.split(".")[1]));

    if (decoded.role === "doctor") {
      navigate("/doctor");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    console.log("LOGIN ERROR:", err.response?.data);
    alert(err.response?.data?.message || "Invalid credentials");
  }
};
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p style={{ marginTop: "15px" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#4ea8de", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;