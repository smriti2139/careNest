import { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState({
    totalChildren: 0,
    totalVaccines: 0,
    totalGrowthRecords: 0,
    overdueVaccines: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/dashboard");
        setData(res.data);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="dashboard-container">
      <h2>Healthcare Dashboard</h2>

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      <div className="cards">
        <div className="card">
          <h3>Total Children</h3>
          <p>{data.totalChildren}</p>
        </div>

        <div className="card">
          <h3>Total Vaccinations</h3>
          <p>{data.totalVaccines}</p>
        </div>

        <div className="card">
          <h3>Total Growth Records</h3>
          <p>{data.totalGrowthRecords}</p>
        </div>

        <div className="card danger">
          <h3>Overdue Vaccines</h3>
          <p>{data.overdueVaccines}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;