import express from "express";
import Growth from "../models/Growth.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();   // ✅ THIS WAS MISSING

// Add Growth Record
router.post("/", protect, async (req, res) => {
  try {
    const { childId, height, weight, headCircumference } = req.body;

    if (!childId || !height || !weight) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const record = await Growth.create({
      childId,
      height,
      weight,
      headCircumference,
      date: new Date()
    });

    res.status(201).json(record);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Growth By Child
router.get("/:childId", protect, async (req, res) => {
  try {
    const records = await Growth.find({
      childId: req.params.childId
    }).sort({ date: -1 });

    res.json(records);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;   // ✅ REQUIRED