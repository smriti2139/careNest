import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Child from "../models/Child.js";
import Vaccination from "../models/Vaccination.js";
import Growth from "../models/Growth.js";

const router = express.Router();
router.get("/", protect, async (req, res) => {
  try {
    const totalChildren = await Child.countDocuments({
      parentId: req.user._id
    });

    const children = await Child.find({
      parentId: req.user._id
    });

    const childIds = children.map(child => child._id);

    const totalVaccines = await Vaccination.countDocuments({
      childId: { $in: childIds }
    });

    const overdueVaccines = await Vaccination.countDocuments({
      childId: { $in: childIds },
      status: "pending",
      dueDate: { $lt: new Date() }
    });

    const totalGrowthRecords = await Growth.countDocuments({
      childId: { $in: childIds }
    });

    res.json({
      totalChildren,
      totalVaccines,
      overdueVaccines,
      totalGrowthRecords
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;