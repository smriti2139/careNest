import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

function DoctorDashboard() {
  const [children, setChildren] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllChildren();
  }, []);

  const fetchAllChildren = async () => {
    try {
      const res = await API.get("/children/all");
      setChildren(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChildren = children.filter((child) =>
    child.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h2>Doctor Dashboard</h2>

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search child by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "20px",
          width: "300px",
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      {filteredChildren.length === 0 ? (
        <p>No children found</p>
      ) : (
        filteredChildren.map((child) => (
          <div
            key={child._id}
            style={{
              padding: "15px",
              marginBottom: "15px",
              background: "#f5f5f5",
              borderRadius: "10px"
            }}
          >
            <h3>{child.name}</h3>
            <p>Parent: {child.parentId?.name}</p>
            <p>Email: {child.parentId?.email}</p>
            <p>DOB: {new Date(child.dob).toLocaleDateString()}</p>
            <p>Gender: {child.gender}</p>
            <p>Birth Weight: {child.birthWeight} kg</p>
          </div>
        ))
      )}
    </Layout>
  );
}

export default DoctorDashboard;