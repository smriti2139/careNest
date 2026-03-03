import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>CareNest 🏥</h1>
        <p className="tagline">
          Role-Based Child Healthcare & Vaccination Management System
        </p>

        <div className="hero-buttons">
          <Link to="/login" className="primary-btn">
            Login
          </Link>
          <Link to="/register" className="secondary-btn">
            Register
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Why CareNest?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>📊 Growth Tracking</h3>
            <p>
              Visualize child growth with interactive charts and health
              insights.
            </p>
          </div>

          <div className="feature-card">
            <h3>💉 Vaccination Alerts</h3>
            <p>
              Track vaccination schedules and get overdue notifications
              instantly.
            </p>
          </div>

          <div className="feature-card">
            <h3>🧑‍⚕️ Doctor Dashboard</h3>
            <p>
              Doctors can securely access and review all children records.
            </p>
          </div>

          <div className="feature-card">
            <h3>📄 Medical Reports</h3>
            <p>
              Generate downloadable medical PDF reports for clinical use.
            </p>
          </div>
        </div>
      </div>

      <footer className="footer">
        © 2026 CareNest | Built with MERN Stack & Docker
      </footer>
    </div>
  );
}

export default Home;