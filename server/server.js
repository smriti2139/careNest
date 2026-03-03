import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import childRoutes from "./routes/childRoutes.js";
import vaccinationRoutes from "./routes/vaccinationRoutes.js";
import growthRoutes from "./routes/growthRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/children", childRoutes);
app.use("/api/vaccinations", vaccinationRoutes);
app.use("/api/growth", growthRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/report", reportRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Root Route
app.get("/", (req, res) => {
  res.send("CareNest API Running");
});

// 🔥 IMPORTANT FOR RENDER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});