import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "parent"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", form);

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (decoded.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      if (err.response?.data?.message === "User already exists") {
        alert("User already exists. Please login.");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Error");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            required
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {/* 🔥 ROLE SELECT */}
          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
            style={{ padding: "10px", borderRadius: "8px" }}
          >
            <option value="parent">Parent</option>
            <option value="doctor">Doctor</option>
          </select>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;