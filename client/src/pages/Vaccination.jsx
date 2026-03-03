import { useEffect, useState } from "react";
import API from "../services/api";
import "./Vaccination.css";

function Vaccination() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [vaccines, setVaccines] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    vaccineName: "",
    dueDate: "",
  });

  const fetchChildren = async () => {
    try {
      const res = await API.get("/children");
      setChildren(res.data);
    } catch (err) {
      setError("Failed to load children");
    }
  };

  const fetchVaccines = async (childId) => {
    try {
      const res = await API.get(`/vaccinations/${childId}`);
      setVaccines(res.data);
    } catch (err) {
      setError("Failed to load vaccines");
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedChild) {
      alert("Select child first");
      return;
    }

    try {
      await API.post("/vaccinations", {
        childId: selectedChild,
        vaccineName: form.vaccineName,
        dueDate: form.dueDate,
      });

      fetchVaccines(selectedChild);
      setForm({ vaccineName: "", dueDate: "" });
    } catch (err) {
      setError("Failed to add vaccine");
    }
  };

  const markCompleted = async (id) => {
    try {
      await API.put(`/vaccinations/${id}`);
      fetchVaccines(selectedChild);
    } catch (err) {
      setError("Failed to update vaccine");
    }
  };

  return (
    <>
      <h2>Vaccination Tracker</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <select
        onChange={(e) => {
          setSelectedChild(e.target.value);
          fetchVaccines(e.target.value);
        }}
      >
        <option value="">Select Child</option>
        {children.map((child) => (
          <option key={child._id} value={child._id}>
            {child.name}
          </option>
        ))}
      </select>

      {selectedChild && (
        <form className="vaccine-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Vaccine Name"
            value={form.vaccineName}
            required
            onChange={(e) =>
              setForm({ ...form, vaccineName: e.target.value })
            }
          />

          <input
            type="date"
            value={form.dueDate}
            required
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value })
            }
          />

          <button type="submit">Add Vaccine</button>
        </form>
      )}

      <div className="vaccine-list">
        {vaccines.map((v) => {
          const isOverdue =
            v.status === "pending" &&
            new Date(v.dueDate) < new Date();

          return (
            <div
              key={v._id}
              className={`vaccine-card ${
                isOverdue ? "overdue" : ""
              }`}
            >
              <h3>{v.vaccineName}</h3>

              <p>
                Due: {new Date(v.dueDate).toLocaleDateString()}
              </p>

              <span
                className={
                  v.status === "completed"
                    ? "badge completed"
                    : "badge pending"
                }
              >
                {v.status}
              </span>

              {isOverdue && (
                <div className="overdue-warning">
                  ⚠️ OVERDUE
                </div>
              )}

              {v.status === "pending" && (
                <button onClick={() => markCompleted(v._id)}>
                  Mark Completed
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Vaccination;