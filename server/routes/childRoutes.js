import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import Child from "../models/Child.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("parent"),
  async (req, res) => {
    try {
      const { name, dob, gender, birthWeight } = req.body;

      const child = await Child.create({
        parentId: req.user._id,
        name,
        dob,
        gender,
        birthWeight,
      });

      res.status(201).json(child);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/", protect, async (req, res) => {
  const children = await Child.find({ parentId: req.user._id });
  res.json(children);
});


// 🔥 GET ALL CHILDREN (DOCTOR ONLY)
router.get(
  "/all",
  protect,
  authorizeRoles("doctor"),
  async (req, res) => {
    try {
      const children = await Child.find().populate("parentId", "name email");
      res.json(children);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
export default router;