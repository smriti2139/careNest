import express from "express";
import Vaccination from "../models/Vaccination.js";
import Child from "../models/Child.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ------------------------------------------------
   CREATE VACCINATION
------------------------------------------------ */

router.post("/", protect, async (req, res) => {
  try {
    const { childId, vaccineName, dueDate } = req.body;

    if (!childId || !vaccineName || !dueDate) {
      return res.status(400).json({ message: "All fields required" });
    }

    const vaccine = await Vaccination.create({
      childId,
      vaccineName,
      dueDate,
      status: "pending"
    });

    res.status(201).json(vaccine);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ------------------------------------------------
   GET ALL VACCINATIONS (FOR LOGGED-IN PARENT)
------------------------------------------------ */

router.get("/", protect, async (req, res) => {
  try {
    const children = await Child.find({ parentId: req.user._id });

    const childIds = children.map((c) => c._id);

    const vaccines = await Vaccination.find({
      childId: { $in: childIds },
    });

    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ------------------------------------------------
   GET VACCINATIONS BY CHILD
------------------------------------------------ */

router.get("/:childId", protect, async (req, res) => {
  try {
    const vaccines = await Vaccination.find({
      childId: req.params.childId,
    });

    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ------------------------------------------------
   GET OVERDUE VACCINES
------------------------------------------------ */

router.get("/overdue/:childId", protect, async (req, res) => {
  try {
    const today = new Date();

    const overdueVaccines = await Vaccination.find({
      childId: req.params.childId,
      status: "pending",
      dueDate: { $lt: today },
    });

    res.json(overdueVaccines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ------------------------------------------------
   MARK AS COMPLETED
------------------------------------------------ */

router.put("/:vaccineId", protect, async (req, res) => {
  try {
    const vaccine = await Vaccination.findById(req.params.vaccineId);

    if (!vaccine) {
      return res.status(404).json({ message: "Vaccine not found" });
    }

    vaccine.status = "completed";
    vaccine.completedAt = new Date();

    await vaccine.save();

    res.json({ message: "Vaccine marked as completed", vaccine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;