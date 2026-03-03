import Growth from "../models/Growth.js";
import Child from "../models/Child.js";

// ➜ Add Growth Record
export const addGrowthRecord = async (req, res) => {
  try {
    const { childId, height, weight, headCircumference } = req.body;

    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    const growth = await Growth.create({
      childId,
      height,
      weight,
      headCircumference,
    });

    // Simple BMI Calculation
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let alert = "Normal";

    if (bmi < 14) alert = "Underweight";
    else if (bmi > 18) alert = "Overweight";

    res.status(201).json({
      message: "Growth record added",
      growth,
      bmi: bmi.toFixed(2),
      healthStatus: alert,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➜ Get Growth History
export const getGrowthHistory = async (req, res) => {
  try {
    const records = await Growth.find({
      childId: req.params.childId,
    }).sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};