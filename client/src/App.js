import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Children from "./pages/Children";
import Vaccination from "./pages/Vaccination";
import Growth from "./pages/Growth";
import Home from "./pages/Home";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import DoctorDashboard  from "./pages/DoctorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected with Layout */}
        <Route
  path="/dashboard"
  element={
    <PrivateRoute allowedRoles={["parent"]}>
      <Layout>
        <Dashboard />
      </Layout>
    </PrivateRoute>
  }
/>

<Route
  path="/children"
  element={
    <PrivateRoute allowedRoles={["parent"]}>
      <Layout>
        <Children />
      </Layout>
    </PrivateRoute>
  }
/>

<Route
  path="/vaccinations"
  element={
    <PrivateRoute allowedRoles={["parent"]}>
      <Layout>
        <Vaccination />
      </Layout>
    </PrivateRoute>
  }
/>

<Route
  path="/growth"
  element={
    <PrivateRoute allowedRoles={["parent"]}>
      <Layout>
        <Growth />
      </Layout>
    </PrivateRoute>
  }
/>

<Route
  path="/doctor"
  element={
    <PrivateRoute allowedRoles={["doctor"]}>
      <DoctorDashboard />
    </PrivateRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;