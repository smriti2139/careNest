import "./Growth.css";
import { useEffect, useState } from "react";
import API from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

function Growth() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    height: "",
    weight: "",
    headCircumference: ""
  });

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const res = await API.get("/children");
      setChildren(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchGrowth = async (childId) => {
    try {
      const res = await API.get(`/growth/${childId}`);
      setRecords(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedChild) {
      alert("Please select a child first");
      return;
    }

    try {
      await API.post("/growth", {
        childId: selectedChild,
        ...form
      });

      fetchGrowth(selectedChild);
      setForm({ height: "", weight: "", headCircumference: "" });

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 Chart friendly data
  const chartData = [...records]
    .reverse()
    .map((rec) => ({
      ...rec,
      formattedDate: new Date(rec.date).toLocaleDateString(),
    }));

  return (
    <div className="growth-container">
      <h2>Growth Tracker</h2>

      <div className="growth-card">
        <select
          className="growth-select"
          onChange={(e) => {
            setSelectedChild(e.target.value);
            fetchGrowth(e.target.value);
          }}
        >
          <option value="">Select Child</option>
          {children.map((child) => (
            <option key={child._id} value={child._id}>
              {child.name}
            </option>
          ))}
        </select>
      </div>

      {selectedChild && (
        <>
          <div className="growth-card">
            <h3>Add Growth Record</h3>

            <form className="growth-form" onSubmit={handleSubmit}>
              <input
                placeholder="Height (cm)"
                value={form.height}
                onChange={(e) =>
                  setForm({ ...form, height: e.target.value })
                }
              />

              <input
                placeholder="Weight (kg)"
                value={form.weight}
                onChange={(e) =>
                  setForm({ ...form, weight: e.target.value })
                }
              />

              <input
                placeholder="Head Circumference (cm)"
                value={form.headCircumference}
                onChange={(e) =>
                  setForm({ ...form, headCircumference: e.target.value })
                }
              />

              <button type="submit">Add Record</button>
            </form>
          </div>

          <div className="growth-card">
            <h3>Growth History</h3>

            {records.length === 0 ? (
              <p>No records yet</p>
            ) : (
              <div className="growth-history">
                {records.map((rec) => (
                  <div key={rec._id} className="history-item">
                    <p><strong>Date:</strong> {new Date(rec.date).toLocaleDateString()}</p>
                    <p>Height: {rec.height} cm</p>
                    <p>Weight: {rec.weight} kg</p>
                    <p>Head: {rec.headCircumference} cm</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🔥 NEW CHART SECTION */}
          <div className="growth-card">
            <h3>Growth Chart</h3>

            {chartData.length === 0 ? (
              <p>No chart data available</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedDate" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="height"
                    stroke="#8884d8"
                    name="Height (cm)"
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#82ca9d"
                    name="Weight (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Growth;