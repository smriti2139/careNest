import { useEffect, useState } from "react";
import API from "../services/api";
import "./Children.css";

function Children() {
  const [children, setChildren] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    birthWeight: "",
  });

  const fetchChildren = async () => {
    try {
      const res = await API.get("/children");
      setChildren(res.data);
    } catch (err) {
      setError("Failed to fetch children");
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/children", form);
      fetchChildren();
      setForm({ name: "", dob: "", gender: "", birthWeight: "" });
    } catch (err) {
      setError("Failed to add child");
    }
  };

  return (
    <>
      <h1>Children</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form className="child-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="date"
          value={form.dob}
          required
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />

        <input
          type="text"
          placeholder="Gender (male/female)"
          value={form.gender}
          required
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        />

        <input
          type="number"
          placeholder="Birth Weight"
          value={form.birthWeight}
          required
          onChange={(e) =>
            setForm({ ...form, birthWeight: e.target.value })
          }
        />

        <button type="submit">Add Child</button>
      </form>

      <div className="child-list">
        {children.map((child) => (
          <div key={child._id} className="child-card">
            <h3>{child.name}</h3>
            <p>DOB: {new Date(child.dob).toLocaleDateString()}</p>
            <p>Gender: {child.gender}</p>
            <p>Birth Weight: {child.birthWeight} kg</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Children;