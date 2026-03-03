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
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/children", childRoutes);
app.use("/api/vaccinations", vaccinationRoutes);
app.use("/api/growth", growthRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/report", reportRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("CareNest API Running");
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});