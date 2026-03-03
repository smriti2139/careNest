import Child from "../models/Child.js";
import Vaccination from "../models/Vaccination.js";
import Growth from "../models/Growth.js";

export const getDashboard = async (req, res) => {
  try {
    const childId = req.params.childId;

    const child = await Child.findById(childId);
    if (!child) return res.status(404).json({ message: "Child not found" });

    const totalVaccines = await Vaccination.countDocuments({ childId });

    const completedVaccines = await Vaccination.countDocuments({
      childId,
      status: "completed",
    });

    const pendingVaccines = await Vaccination.countDocuments({
      childId,
      status: "pending",
    });

    const overdueVaccines = await Vaccination.countDocuments({
      childId,
      status: "pending",
      dueDate: { $lt: new Date() },
    });

    const latestGrowth = await Growth.findOne({ childId }).sort({ date: -1 });

    let bmi = null;
    let healthStatus = "No data";

    if (latestGrowth) {
      const heightInMeters = latestGrowth.height / 100;
      bmi = latestGrowth.weight / (heightInMeters * heightInMeters);

      if (bmi < 14) healthStatus = "Underweight";
      else if (bmi > 18) healthStatus = "Overweight";
      else healthStatus = "Normal";
    }

    res.json({
      childName: child.name,
      totalVaccines,
      completedVaccines,
      pendingVaccines,
      overdueVaccines,
      latestBMI: bmi ? bmi.toFixed(2) : null,
      healthStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};